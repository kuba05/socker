import React from 'react';
//import styles from './TournamentSetupInput.module.scss';


interface TorunamentDaysSetupProps {
    //length of each playday in minutes
    days: number[];
    //function that changes days
    daysChange: (days: number[]) => void;
};

interface TorunamentDaysSetupState {
    days: number[];
};

export class TournamentDaysSetup extends React.Component<TorunamentDaysSetupProps, TorunamentDaysSetupState> {
    constructor (props: TorunamentDaysSetupProps){
        super(props);
        this.state = {days: props.days};
    }
    
    changeDay = (index: number, Svalue: string) => {
        const value = parseFloat(Svalue)
        if ( !isNaN(value) ) {
            this.setState (
                (state: Readonly<TorunamentDaysSetupState>, props: Readonly<TorunamentDaysSetupProps>) => {
                    console.log(state);
                    let days = [...state.days];
                    days[index] = value*60;
                    console.log(days);
                    return {days: days}
                }
            )
        }
    }
    
    componentDidUpdate (prevProps: TorunamentDaysSetupProps, prevState: TorunamentDaysSetupState){
        //console.log(this.props);
        //console.log(prevProps);        
        if (this.props !== prevProps){
            this.setState ( {days: this.props.days} );
        } else if (this.state.days !== this.props.days) {
            this.props.daysChange ( this.state.days );
        }
    }
    
    render() {
        const days = [];
        for (let i = 0; i < this.props.days.length; i++){
            days.push(
                <li key = {i}>
                    <input type="number"
                        min={1} 
                        defaultValue={this.props.days[i]/60}
                        onChange = {(event) => this.changeDay(i, event.target.value)}
                        onInput= { (event: any) => {
                            //only positive integers are posible
                            event.target.value = event.target.value.replace(/[^0-9.]*/g,'')
                        }}
                    />
                </li>
            )
        }
        return (
            <>
              <p> délka hracího dne [h]</p>
              <ol>
                  {days}
              </ol>
            </>
        )
    };
    
};