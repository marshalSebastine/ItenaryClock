import { useEffect, useRef, useState } from 'react';
import './ItenaryClock.styles.css';

const ItenaryClock = () => {
    let numberofchildren = 3
    let placeAtAngleGap = 360 / numberofchildren
    let childrenDummyList = ['child1', 'child2', 'child3']
    const runnerStateIndex = useRef(0)
    const defaultRunnerStates = []
    const animationState = {
        'play': 'running',
        'pause': 'paused',
    }
    childrenDummyList.forEach((child, index) => {
        defaultRunnerStates.push('initial')
    })
    const [runnerState, setRunnerStates] = useState(defaultRunnerStates);

    function triggerAnimationState(forChildIndx) {
        setRunnerStates(oldRunnerState => {
            let newstate = oldRunnerState.map((state, indx) => {
                if (indx === forChildIndx) {
                    let animationname = `moveincircle${indx}`;
                    return `${animationname} 5s linear`
                }
                return 'initial'
            })
            console.log(newstate)
            return (newstate)
        })
    }
    useEffect(() => {
        setTimeout(() => {
            triggerAnimationState(0)
        }, 500)

    }, [])

    function handleAnimationEnd(evnt, indx) {
        if (indx == numberofchildren - 1) {
            runnerStateIndex.current = 0
            triggerAnimationState(0)
        } else {
            runnerStateIndex.current = (indx+1)
            triggerAnimationState(indx + 1)
        }
    }
    return (
        <div className='itenaryclock_wrapper'>
            <div className='itenaryclock_innercircle'>
                {childrenDummyList.map((child, index) => {
                    let styleSheet = document.styleSheets[0];
                    let animationName = `moveincircle${index}`;
                    let keyframes =
                        `@-webkit-keyframes ${animationName} {
                0% {
                    transform: rotate(${placeAtAngleGap * index}deg) 
                        translateY(calc(var(--circlerad)* -1px)) rotate(${placeAtAngleGap * index * -1}deg);
                }
                100% {
                    transform: rotate(${placeAtAngleGap * (index + 1)}deg) 
                          translateY(calc(var(--circlerad)* -1px)) rotate(${placeAtAngleGap * (index + 1) * -1}deg);
                }
               }`;
                    styleSheet.insertRule(keyframes, styleSheet.cssRules.length)
                    let animationStyle = {
                        transform: `rotate(${index * placeAtAngleGap}deg)
                                                    translateY(calc(var(--circlerad)*-1px))
                                                    rotate(${index * placeAtAngleGap * -1}deg)`,
                        animation: runnerState[index]
                    }
                    return (<div key={index} style={animationStyle}
                        onAnimationEnd={(evnt) => { handleAnimationEnd(evnt, index) }}
                        className='timerunner' >
                            <div className={(runnerStateIndex.current === index) ? 'pulsating-circle-before': ''}/>
                            <div className={(runnerStateIndex.current === index) ? 'pulsating-circle-after': ''}/>
                        </div>)
                })}
            </div>
        </div>
    )
}

export default ItenaryClock
