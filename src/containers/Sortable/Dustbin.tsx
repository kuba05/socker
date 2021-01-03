import React from 'react'
import { useDrop, DropTargetMonitor } from 'react-dnd'
// import { useDrop } from 'react-dnd'
import { ItemTypes } from './ItemTypes'


function getStyle(backgroundColor: string, border: string): React.CSSProperties {
	return {
        border,
//		border: '1px solid rgba(0,0,0,0.2)',
		minHeight: '2rem',
//		minWidth: '8rem',
		color: 'white',
		backgroundColor,
        width: 400,
//		padding: '2rem',
//		paddingTop: '1rem',
//		margin: '1rem',
//		textAlign: 'center',
//		float: 'left',
//		fontSize: '1rem',
	}
}

export interface DustbinProps {
    slot: number
	greedy?: boolean
    floating?: boolean
    moveCard: (dragSourceSlot: number, dragIndex: number, hoverTargetSlot: number, hoverIndex: number) => [number, number]
    dropCard: () => void
}

interface DragItem {
    slot: number
	index: number
	id: string
	type: string
}

export interface DustbinState {
	hasDropped: boolean
	hasDroppedOnChild: boolean
}

export const Dustbin: React.FC<DustbinProps> = ({ slot, greedy, floating, moveCard, dropCard, children }) => {
//	const [hasDropped, setHasDropped] = useState(false)
//	const [hasDroppedOnChild, setHasDroppedOnChild] = useState(false)

	const [{ isOver, isOverCurrent }, drop] = useDrop({
		accept: ItemTypes.CARD,
        
        hover(item: DragItem, monitor: DropTargetMonitor) {
			const didDrop = monitor.didDrop()
			if (didDrop && !greedy) {
				return
			}
            // don't change anything if card move is within the same slot, as this was already handled during hover
            if (item.slot === slot) {
                return
            }
            // we moving card into a new slot, therefore it's always becoming to be the first card
            // Note: we're mutating the monitor item here!
			// Generally it's better to avoid mutations,
			// but it's good here for the sake of performance
			// to avoid expensive index searches.
//            [ item.slot, item.index ] 
console.log('dustbin calling moveCard')
            let s, i;
            [ s, i ] = moveCard(item.slot, item.index, slot, 0)
            if ( s !== item.slot ) {
               console.log(`item slot updated from ${item.slot} to ${s}`)
               item.slot = s
            }
            if ( i !== item.index ) {
               console.log(`item index updated from ${item.index} to ${i}`)
               item.index = i
            }
        },
         
        drop(item: DragItem, monitor: DropTargetMonitor) {
            dropCard()
        },
        
/*        
			const didDrop = monitor.didDrop()
			if (didDrop && !greedy) {
				return
			}
            // don't change anything if card move is within the same slot, as this was already handled during hover
            if (item.slot === slot) {
                return
            }
            // we moving card into a new slot, therefore it's always becoming to be the first card
            // Note: we're mutating the monitor item here!
			// Generally it's better to avoid mutations,
			// but it's good here for the sake of performance
			// to avoid expensive index searches.
            [ item.slot, item.index ] = moveCard(item.slot, item.index, slot, 0)
            // item.slot = slot
            // item.index = 0
		},
*/          
		collect: (monitor) => ({
			isOver: monitor.isOver(),
			isOverCurrent: monitor.isOver({ shallow: true }),
		}),
	})

	let backgroundColor = 'rgba(0, 0, 0, .5)'

	if (isOverCurrent || (isOver && greedy)) {
		backgroundColor = 'darkgreen'
	}

    let border = '1px solid rgba(0,0,0,0.2)'
    
    if (floating) {
        border = '4px solid red'
    }
    
	return (
		<div ref={drop} style={getStyle(backgroundColor, border)}>
        {slot}
			<div>{children}</div>
		</div>
	)
}
