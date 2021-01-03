import React, { useRef } from 'react'
import { useDrag, useDrop, DropTargetMonitor } from 'react-dnd'
import { ItemTypes } from './ItemTypes'
import { XYCoord } from 'dnd-core'

function getStyle(backgroundColor: string, opacity: number): React.CSSProperties {
	return {
    	border: '1px dashed gray',
    	padding: '0.5rem 1rem',
    	marginBottom: '.5rem',
    	backgroundColor, // :'white',
        opacity,
    	cursor: 'move',
/*		border: '1px solid rgba(0,0,0,0.2)',
		minHeight: '8rem',
		minWidth: '8rem',
		color: 'white',
		backgroundColor,
		padding: '2rem',
		paddingTop: '1rem',
		margin: '1rem',
		textAlign: 'center',
		float: 'left',
		fontSize: '1rem', */
	}
}

export interface CardProps {
    slot: number
	index: number
	id: any
	text: string
	moveCard: (dragSourceSlot: number, dragIndex: number, hoverTargetSlot: number, hoverIndex: number) => [number, number]
}

interface DragItem {
    slot: number
	index: number
	id: string
	type: string
}
export const Card: React.FC<CardProps> = ({ slot, index, id, text, moveCard }) => {
	const ref = useRef<HTMLDivElement>(null)
	const [, drop] = useDrop({
		accept: ItemTypes.CARD,
   		drop(item: DragItem, monitor: DropTargetMonitor) {
			const didDrop = monitor.didDrop()
            // moveCard(item.slot, item.index, slot, index)
		},
/*         
		hover(item: DragItem, monitor: DropTargetMonitor) {
		    if (!ref.current) {
				return
			}
            const dragSlot = item.slot
			const dragIndex = item.index
            const hoverSlot = slot
			const hoverIndex = index
//console.log(`hover: ${dragSlot}:${dragIndex} -> ${hoverSlot}:${hoverIndex}`)   

			// Don't replace items with themselves
			if (dragSlot === hoverSlot && dragIndex === hoverIndex) {
				return
			}

			// Determine rectangle on screen
			const hoverBoundingRect = ref.current.getBoundingClientRect()

			// Get vertical middle
			const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

			// Determine mouse position
			const clientOffset = monitor.getClientOffset()

			// Get pixels to the top
			const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top

			// Only perform the move when the mouse has crossed half of the items height
			// When dragging downwards, only move when the cursor is below 50%
			// When dragging upwards, only move when the cursor is above 50%

			// Dragging downwards
			if (dragSlot === hoverSlot && dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
				return
			}

			// Dragging upwards
			if (dragSlot === hoverSlot && dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
				return
			}

			// Time to actually perform the action
			// Note: we're mutating the monitor item here!
			// Generally it's better to avoid mutations,
			// but it's good here for the sake of performance
			// to avoid expensive index searches.
//			[ item.slot, item.index ] = moveCard(dragSlot, dragIndex, hoverSlot, hoverIndex)

            // item.slot = hoverSlot
			// item.index = hoverIndex
		},
*/        
        collect: (monitor) => ({
			isOver: monitor.isOver(),
			isOverCurrent: monitor.isOver({ shallow: true }),
		}),
	})

	const [{ isDragging }, drag] = useDrag({
		item: { type: ItemTypes.CARD, slot, index, id },
		collect: (monitor: any) => ({
			isDragging: monitor.isDragging(),
		}),
	})

	const opacity = isDragging ? 0.5 : 1
	drag(drop(ref))
   	let backgroundColor = 'rgba(0, 0, 0, .5)'

	return (
		<div ref={ref} style={getStyle(backgroundColor, opacity)}>
			{text}
		</div>
	)
}
