import { useLayoutEffect, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import type { TracingDefinition } from '../lessonTypes'

interface LetterTracingProps {
  definition: TracingDefinition
}

interface SvgPoint {
  x: number
  y: number
}

interface ArrowPosition extends SvgPoint {
  angle: number
}

const FORWARD_LOOKAHEAD = 150
const SAMPLE_SPACING = 4
const COMPLETION_DISTANCE = 8
const ARROW_LEAD = 24

function distanceBetween(a: SvgPoint, b: SvgPoint) {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

export function LetterTracing({ definition }: LetterTracingProps) {
  const svgRef = useRef<SVGSVGElement | null>(null)
  const phaseRefs = useRef<Array<SVGPathElement | null>>([])
  const phaseLengthsRef = useRef<number[]>([])
  const phaseDistancesRef = useRef(definition.phases.map(() => 0))
  const currentPhaseRef = useRef(0)
  const activePointerRef = useRef<number | null>(null)
  const completedRef = useRef(false)
  const [phaseLengths, setPhaseLengths] = useState<number[]>([])
  const [phaseDistances, setPhaseDistances] = useState<number[]>(
    definition.phases.map(() => 0),
  )
  const [activePhaseIndex, setActivePhaseIndex] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [arrow, setArrow] = useState<ArrowPosition>({
    ...definition.startPoint,
    angle: 90,
  })

  useLayoutEffect(() => {
    const lengths = definition.phases.map((_, index) =>
      phaseRefs.current[index]?.getTotalLength() ?? 0,
    )
    phaseLengthsRef.current = lengths
    setPhaseLengths(lengths)

    const firstPath = phaseRefs.current[0]
    const firstLength = lengths[0]
    if (firstPath && firstLength) {
      const point = firstPath.getPointAtLength(0)
      const tangentPoint = firstPath.getPointAtLength(Math.min(10, firstLength))
      setArrow({
        x: point.x,
        y: point.y,
        angle:
          (Math.atan2(tangentPoint.y - point.y, tangentPoint.x - point.x) * 180) /
          Math.PI,
      })
    }
  }, [definition])

  const toSvgPoint = (clientX: number, clientY: number): SvgPoint | null => {
    const svg = svgRef.current
    const matrix = svg?.getScreenCTM()
    if (!svg || !matrix) return null

    const point = svg.createSVGPoint()
    point.x = clientX
    point.y = clientY
    const transformed = point.matrixTransform(matrix.inverse())
    return { x: transformed.x, y: transformed.y }
  }

  const continuationPoint = () => {
    const phaseIndex = currentPhaseRef.current
    const path = phaseRefs.current[phaseIndex]
    if (!path) return definition.startPoint
    return path.getPointAtLength(phaseDistancesRef.current[phaseIndex] ?? 0)
  }

  const publishProgress = () => {
    setPhaseDistances([...phaseDistancesRef.current])

    const phaseIndex = currentPhaseRef.current
    const path = phaseRefs.current[phaseIndex]
    const length = phaseLengthsRef.current[phaseIndex]
    if (!path || !length || completedRef.current) return

    const currentDistance = phaseDistancesRef.current[phaseIndex] ?? 0
    const arrowDistance = Math.min(length, currentDistance + ARROW_LEAD)
    const before = path.getPointAtLength(Math.max(0, arrowDistance - 5))
    const after = path.getPointAtLength(Math.min(length, arrowDistance + 5))
    const point = path.getPointAtLength(arrowDistance)
    setArrow({
      x: point.x,
      y: point.y,
      angle: (Math.atan2(after.y - before.y, after.x - before.x) * 180) / Math.PI,
    })
  }

  const completeCurrentPhase = (phaseIndex: number) => {
    phaseDistancesRef.current[phaseIndex] = phaseLengthsRef.current[phaseIndex]

    if (phaseIndex < definition.phases.length - 1) {
      currentPhaseRef.current = phaseIndex + 1
      setActivePhaseIndex(phaseIndex + 1)
      return
    }

    completedRef.current = true
    setIsComplete(true)
  }

  const advanceToward = (pointer: SvgPoint) => {
    if (completedRef.current) return

    const phaseIndex = currentPhaseRef.current
    const path = phaseRefs.current[phaseIndex]
    const length = phaseLengthsRef.current[phaseIndex]
    if (!path || !length) return

    const currentDistance = phaseDistancesRef.current[phaseIndex]
    const windowEnd = Math.min(length, currentDistance + FORWARD_LOOKAHEAD)
    let closestDistance = Number.POSITIVE_INFINITY
    let closestPathDistance = currentDistance

    for (
      let candidate = currentDistance;
      candidate <= windowEnd;
      candidate += SAMPLE_SPACING
    ) {
      const candidatePoint = path.getPointAtLength(candidate)
      const distance = distanceBetween(pointer, candidatePoint)
      if (distance < closestDistance) {
        closestDistance = distance
        closestPathDistance = candidate
      }
    }

    const endPoint = path.getPointAtLength(windowEnd)
    const endDistance = distanceBetween(pointer, endPoint)
    if (endDistance < closestDistance) {
      closestDistance = endDistance
      closestPathDistance = windowEnd
    }

    if (closestDistance > definition.touchTolerance) return

    phaseDistancesRef.current[phaseIndex] = Math.max(
      currentDistance,
      closestPathDistance,
    )

    if (length - phaseDistancesRef.current[phaseIndex] <= COMPLETION_DISTANCE) {
      completeCurrentPhase(phaseIndex)
    }

    publishProgress()
  }

  const handlePointerDown = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (completedRef.current || activePointerRef.current !== null) return

    const pointer = toSvgPoint(event.clientX, event.clientY)
    if (!pointer || distanceBetween(pointer, continuationPoint()) > definition.touchTolerance + 18) {
      return
    }

    activePointerRef.current = event.pointerId
    event.currentTarget.setPointerCapture(event.pointerId)
    advanceToward(pointer)
  }

  const handlePointerMove = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (activePointerRef.current !== event.pointerId) return

    const pointerEvents = event.nativeEvent.getCoalescedEvents?.() ?? [event.nativeEvent]
    for (const pointerEvent of pointerEvents) {
      const pointer = toSvgPoint(pointerEvent.clientX, pointerEvent.clientY)
      if (pointer) advanceToward(pointer)
    }
  }

  const finishPointer = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (activePointerRef.current !== event.pointerId) return
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    activePointerRef.current = null
  }

  return (
    <div className={`tracing-screen${isComplete ? ' is-complete' : ''}`}>
      {isComplete && definition.completion === 'stars' && (
        <div className="tracing-stars" aria-hidden="true">
          {['★', '✦', '★', '✦', '★'].map((star, index) => (
            <span key={index}>{star}</span>
          ))}
        </div>
      )}

      <svg
        ref={svgRef}
        className="tracing-interaction"
        viewBox={definition.viewBox}
        role="img"
        aria-label={definition.ariaLabel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishPointer}
        onPointerCancel={finishPointer}
        onLostPointerCapture={finishPointer}
      >
        <g className="tracing-guide" fill="none" strokeLinecap="round" strokeLinejoin="round">
          {definition.phases.map((phase, index) => (
            <path
              key={`faded-${phase.id}`}
              ref={(path) => {
                phaseRefs.current[index] = path
              }}
              d={phase.path}
              stroke={definition.strokeColor}
              className="tracing-letter-faded"
            />
          ))}

          {definition.phases.map((phase, index) => {
            const length = phaseLengths[index] ?? 0
            const progress = Math.min(phaseDistances[index] ?? 0, length)
            if (!progress) return null

            return (
              <path
                key={`progress-${phase.id}`}
                d={phase.path}
                stroke={definition.strokeColor}
                className="tracing-letter-progress"
                pathLength={length || undefined}
                strokeDasharray={length ? `${length} ${length}` : undefined}
                strokeDashoffset={length ? length - progress : undefined}
              />
            )
          })}

          {!isComplete && (
            <path
              d={definition.phases[activePhaseIndex].path}
              className="tracing-dots"
            />
          )}
        </g>

        {!isComplete && (
          <g
            className="tracing-direction-arrow"
            transform={`translate(${arrow.x} ${arrow.y}) rotate(${arrow.angle})`}
            aria-hidden="true"
          >
            <path d="M -31 0 H 2" />
            <path d="M -8 -11 L 4 0 L -8 11" />
          </g>
        )}
      </svg>
    </div>
  )
}
