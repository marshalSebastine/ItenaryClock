import { useEffect, useRef, useState } from 'react';
import './ItenaryClock.styles.css';

const ItenaryClock = () => {
    let numberofchildren = 3
    let placeAtAngleGap = 360/numberofchildren
    let childrenDummyList = ['child1','child2','child3']
    let clockradius = 450/2
    const defaultRunnerStates = []
    const animationState = {
        'play': 'running',
        'pause': 'paused',
    }
    let playingRunnerIndex = useRef(-1)
    childrenDummyList.forEach((child,index) => {
        defaultRunnerStates.push('initial')
    })
    const [runnerState,setRunnerStates] = useState(defaultRunnerStates);

    function triggerAnimationState(forChildIndx) {
            setRunnerStates(oldRunnerState => {
                let newstate =  oldRunnerState.map((state,indx) => {
                    if(indx === forChildIndx) {
                        let animationname = `moveincircle${indx}`;
                        return `${animationname} 5s linear`
                    }
                    return 'initial'
                })
                console.log(newstate)
                return(newstate)
            })
    }
    function playRunnerAndPauseOthers(forChildIndx) {
        childrenDummyList.forEach((child,indx) => {
            if (indx == forChildIndx) triggerAnimationState(indx,animationState.play)
            else{
                triggerAnimationState(indx,animationState.pause)
            }
        })
    }
    useEffect(() => {
        setTimeout(() => {
            triggerAnimationState(0)
        },500)
        
    }, [])

    function handleAnimationEnd(evnt,indx) {
        if(indx == numberofchildren-1){
            triggerAnimationState(0)
        }else{
            triggerAnimationState(indx+1)
        }
    }
    return(
        <div className='itenaryclock_wrapper'>
            {childrenDummyList.map((child,index) => {
               let styleSheet = document.styleSheets[0];
               let animationName = `moveincircle${index}`;
               let keyframes =
               `@-webkit-keyframes ${animationName} {
                0% {
                    transform: rotate(${placeAtAngleGap*index}deg) 
                        translateY(-${clockradius}px) rotate(${placeAtAngleGap*index*-1}deg);
                }
                100% {
                    transform: rotate(${placeAtAngleGap*(index+1)}deg) 
                          translateY(-${clockradius}px) rotate(${placeAtAngleGap*(index+1)*-1}deg);
                }
               }`;
               styleSheet.insertRule(keyframes,styleSheet.cssRules.length)
               let animationStyle =  {  transform: `rotate(${index*placeAtAngleGap}deg)
                                                    translateY(calc(var(--circlerad)*-1px))
                                                    rotate(${index*placeAtAngleGap*-1}deg)`,
                                        animation: runnerState[index]}
               return <div  key={index} style={animationStyle} 
                            onAnimationEnd={(evnt) => {handleAnimationEnd(evnt,index)}}
                            className='timerunners'/>
            })}           
        </div>
    )
}

export default ItenaryClock
