import React from 'react';

import { Slider } from '@material-ui/core';

import styles from './TournamentSetupInput.module.scss';


interface TournamentSetupInputProps {
    //length of each playday in minutes
    days: number;
    //function that changes days
    daysChange: (days: number) => void;
    
    //length of a day in minutes
    dayLength: number;
    //function that changes dayLength
    dayLengthChange: (dayLength: number) => void;
    
    //length of a match in minutes
    matchLength: number;
    //function that changes matchLength
    matchLengthChange: (matchLength: number) => void;
    
    //length of a break in minutes
    breakLength: number;
    //function that changes breakLength
    breakLengthChange: (breakLength: number) => void;
};

export class TournamentSetupInput extends React.Component<TournamentSetupInputProps> {
    
    handleDaysChange = (value: any) => {
        this.props.daysChange (value);
    };
    
    handleDayLengthChange = (value: any) => {
        this.props.dayLengthChange (value*60);
    };
    
    handleMatchChange = (value: any) => {
        this.props.matchLengthChange (value);
    };
    
    handleBreakChange = (value: any) => {
        this.props.breakLengthChange (value);
    };
    
    render() {
        return (
            <div className = {styles.mainBox}>
                <div>
                    <p>
                        délka zápasu [min]
                    </p>
                    <div className = "slider">
                        <Slider
                          min = {1}
                          max = {90}
                          step = {1}
                          valueLabelDisplay="on"
                          value = {this.props.matchLength}
                          onChange = {(e,value) => this.handleMatchChange(value)}
                        />
                    </div>
                </div>
                <div>
                    <p>
                        délka přestávky [min]
                    </p>
                    <div className = "slider">
                        <Slider
                          min = {0}
                          max = {30}
                          step = {0.5}
                          valueLabelDisplay="on"
                          value = {this.props.breakLength}
                          onChange = {(e,value) => this.handleBreakChange(value)}
                        />
                    </div>
                </div>
                <div>
                    <p>
                        počet hracích dnů
                    </p>
                    <div className = "slider">
                        <Slider
                          min = {1}
                          max = {5}
                          step = {1}
                          valueLabelDisplay="on"
                          value = {this.props.days}
                          onChange = {(e,value) => this.handleDaysChange(value)}
                        />
                    </div>
                </div>
                <div>
                    <p>
                        délka hracího dne [h]
                    </p>
                    <div className = "slider">
                        <Slider
                          min = {1}
                          max = {24}
                          step = {0.5}
                          valueLabelDisplay="on"
                          value = {this.props.dayLength/60}
                          onChange = {(e,value) => this.handleDayLengthChange(value)}
                        />
                    </div>
                </div>
            </div>
        )
    };
    
};