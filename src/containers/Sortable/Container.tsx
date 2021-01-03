import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
// import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { Card } from './Card'
import { Dustbin } from './Dustbin'
import update from 'immutability-helper'
import { DnDCard } from 'model';

/*const style = {
	width: 400,
} */

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    with: 400,
  },
  paper: {
    height: 140,
    width: 100,
  },
  control: {
    padding: theme.spacing(2),
  },
}));

interface DndContainerProps{
    cards: DnDCard[][],
    categoriesChange?: (a: DnDCard[][]) => void,
}


export interface Item {
	id: number
	text: string
}

export interface DndContainerState {
	cards: Item[]
}

function filterNonEmpty(element: any, index: number, array: any) {
    return element.length > 0
}

export const DndContainer: React.FC<DndContainerProps> = (props:DndContainerProps) => {
    console.log(props);
    const spacing = 2;
    const classes = useStyles();
    /*if(props.cards===undefined){
        return <p>something went wrong</p>
    }*/
    const [floating, setFloating] = useState(-1)
    const [cards, setCards] = useState([
        [
        		{
        			id: 1,
        			text: 'Write a cool JS library',
        		},
        		{
        			id: 2,
        			text: 'Make it generic enough',
        		},
        		{
        			id: 3,
        			text: 'Write README',
        		},
        		{
        			id: 4,
        			text: 'Create some examples',
        		},
        		{
        			id: 5,
        			text:
        				'Spam in Twitter and IRC to promote it (note that this element is taller than the others)',
        		},
        		{
        			id: 6,
        			text: '???',
        		},
        		{
        			id: 7,
        			text: 'PROFIT',
        		},
        ]
    ])
        
    const dropCard = () => {
        setCards(cards.filter(filterNonEmpty))
        if (floating > -1) setFloating(-1)
    }
        
    //const moveCard = useCallback(
    const moveCard = (dragSourceSlot: number, dragIndex: number, hoverTargetSlot: number, hoverIndex: number) :[number, number] =>  {
        console.log(`moveCard ${dragSourceSlot}:${dragIndex} -> ${hoverTargetSlot}:${hoverIndex} / ${cards.length}`)
        
        // don't change anything if card move is within the same slot, as this was already handled during hover
        if (dragSourceSlot === hoverTargetSlot && hoverIndex === dragIndex) {
            if (floating === -1 && cards[dragSourceSlot>>1].length === 0) setFloating(dragSourceSlot)
            return [ hoverTargetSlot, hoverIndex ];
        }
        // don't change anything if you moving the last card from slot to space before or after
        // if (cards[dragSourceSlot >> 1].length === 1 && (dragSourceSlot+1 === hoverTargetSlot || dragSourceSlot-1 === hoverTargetSlot)) 
        // return [ hoverTargetSlot, hoverIndex ];
        // if we moving card to empty slot, reset the index so splice work fine
        // if (hoverIndex === -1) hoverIndex = 0;    
        
        let newStack = cards
        if (hoverTargetSlot%2 === 0 && hoverTargetSlot !== floating - 1) {
             if (floating > -1) {
                console.log('removing old floating stack')                     
                console.log(newStack)
                // delete old floating box, it should be empty
                if (newStack[floating >> 1].length > 0) {
                    console.warn('floating box should be empty')
                    console.log(`floating: ${floating} dragSourceSlot: ${dragSourceSlot}`)
                    console.log(newStack)
                }
                newStack = update(newStack, {$splice: [[floating >> 1, 1]]})
                    console.log('>>')                        
                    console.log(newStack)
                if (floating < dragSourceSlot) dragSourceSlot-=2;
                if (floating < hoverTargetSlot) hoverTargetSlot-=2;
            }
            if (newStack[dragSourceSlot>>1].length === 1 && (dragSourceSlot === hoverTargetSlot + 1 || dragSourceSlot === hoverTargetSlot - 1)) {
                hoverTargetSlot = dragSourceSlot
                setFloating(hoverTargetSlot) 
            } else {
                newStack = update(newStack, {$splice: [[hoverTargetSlot >> 1, 0, []]] })
                console.log('inserted new stack: ')
                console.log(newStack)    
                console.log('new floating: ')
                console.log(hoverTargetSlot + 1)
                if (hoverTargetSlot < dragSourceSlot) dragSourceSlot++;
                hoverTargetSlot++;
                setFloating(hoverTargetSlot);
            }
        }
        
            
        //dragSourceSlot = dragSourceSlot >> 1
        //hoverTargetSlot = hoverTargetSlot >> 1            
        console.log(`moveCard ${dragSourceSlot >> 1}:${dragIndex} -> ${hoverTargetSlot >> 1}:${hoverIndex}`)
		    
        const dragCard = newStack[dragSourceSlot >> 1][dragIndex]
        
        console.log(dragCard)
        console.log(newStack)    
        
        if (dragSourceSlot >> 1 === hoverTargetSlot >> 1) {
				    newStack = update(newStack,
                {
                    [dragSourceSlot >> 1]: {
            						$splice: [
            							[dragIndex, 1],
            							[hoverIndex, 0, dragCard],
            						],
                    },
                }
				    )
        } else { 
				    newStack = update(newStack,
                {
                    // remove card from source slot
                    [dragSourceSlot >> 1]: {
            						$splice: [
            							[dragIndex, 1],
            						],
                    },
                    // then insert it into target slot
                    [hoverTargetSlot >> 1] : {
    						        $splice: [
                          [hoverIndex, 0, dragCard],
    						        ],
                    },
                }
				    )
            /* if (newStack[dragSourceSlot >> 1].length === 0) {
                newStack = update(newStack, {$splice: [[dragSourceSlot >> 1, 1]]})
                if (hoverTargetSlot >= dragSourceSlot) hoverTargetSlot--;
            }  */
        }
        console.log(">>>")
        console.log(newStack)

        if (hoverTargetSlot%2 === 1 && floating > -1 && hoverTargetSlot !== floating) {
            console.log(`hoverTargetSlot: ${hoverTargetSlot}, floating: ${floating}`)                
            // delete old floating box, it should be empty
            if (newStack[floating >> 1].length > 0) {
                console.warn('floating box should be empty')
                console.log(`floating: ${floating} dragSourceSlot: ${dragSourceSlot}`)
                console.log(newStack)
            }
            newStack = update(newStack, {$splice: [[floating >> 1, 1]]})
            // if (floating < dragSourceSlot) dragSourceSlot-=2;
            if (floating < hoverTargetSlot) hoverTargetSlot-=2;
            setFloating(-1);
        }
                
        console.log(">>>")
        console.log(newStack)                                                 
        if(props.categoriesChange)props.categoriesChange(newStack);
				setCards(newStack)
        console.log(`${hoverTargetSlot}:${hoverIndex}`)                
        console.log('-------------------------------')                
        return [ hoverTargetSlot, hoverIndex ]
    } //,
  //			[cards],
//		)


    const renderCard = (card: { id: number; text: string }, slot: number, index: number) => {
        return (
            <Card
              slot={slot}
              index={index}
              key={card.id}
              id={card.id}
              text={card.text}
              moveCard={moveCard}
            />
        )
    }

    const renderSlots = () => {
        const slots: any = []
        /*console.log('rendering')
        console.log('floating: ')
        console.log(floating)
        console.log('cards:') 
        console.log(cards) */           
        for (let i = 0; i < cards.length; i++) {
            // const slot = cards[i]
            //console.log(`i: ${i} floating: ${floating}`)                
            if ( floating < 0 || ((i !== (floating >> 1)) && (i !== (floating >> 1) + 1) )) {
                slots.push( <Grid item xs={1}> <Dustbin moveCard={moveCard} dropCard={dropCard} greedy={false} slot={i*2} /> </Grid> )
            }
            slots.push( <Grid item xs={12}> <Dustbin moveCard={moveCard} dropCard={dropCard} greedy={false} slot={i*2+1} floating={i === (floating>>1)}>
                {cards[i].map((card, index) => renderCard(card, i*2+1, index))}    
            </Dustbin> </Grid>
            )
        }
        if (cards.length-1 !== (floating>>1)) {
            slots.push(<Grid item xs={1}> <Dustbin moveCard={moveCard} dropCard={dropCard} greedy={false} slot={cards.length*2} /> </Grid>)
        }
        return (slots)
    }
        
    return (
        <>
        <Grid container className={classes.root} spacing={spacing}>
        { renderSlots() }
        </Grid>
        </>
    )
 
}
