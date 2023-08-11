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
    let playingRunnerIndex = useRef(0)
    childrenDummyList.forEach((child,index) => {
        defaultRunnerStates.push(animationState.pause)
    })
    const [runnerState,setRunnerStates] = useState(defaultRunnerStates);

    function triggerAnimationState(forChildIndx,stateOfPlay) {
            setRunnerStates(oldRunnerState => {
                return oldRunnerState.map((state,indx) => {
                    if(indx === forChildIndx) return stateOfPlay
                    return state
                })
            })
    }
    useEffect(() => {
        triggerAnimationState(playingRunnerIndex.current,animationState.play)
        const playRepeater = setTimeout(() => {
            if (playingRunnerIndex.current == 4){
                playingRunnerIndex.current = 0
            }else {
                playingRunnerIndex.current += 1
            }
            triggerAnimationState(playingRunnerIndex.current,animationState.play)
        },5000)
        return () => clearInterval(playRepeater);
         
    }, [])
    return(
        <div className='itenaryclock_wrapper'>
            {childrenDummyList.map((child,index) => {
               let styleSheet = document.styleSheets[0];
               let animationName = `moveincircle${index}`;
               let keyframes =
               `@-webkit-keyframes ${animationName} {
                0% {
                    transform: rotate(${index*placeAtAngleGap}deg) 
                        translateY(225px) rotate(${index*placeAtAngleGap*-1}deg);
                }
                100% {
                    transform: rotate(${(index+1)*placeAtAngleGap}deg) 
                          translateY(225px) rotate(${(index+1)*placeAtAngleGap*-1}deg);
                }
               }`;
               styleSheet.insertRule(keyframes,styleSheet.cssRules.length)
               let animationStyle =  {  transform: `rotate(${index*placeAtAngleGap}deg) translate(calc(var(--circlerad)*-1px)) rotate(${index*placeAtAngleGap*-1}deg)`,
                                        animation: `${animationName} 5s linear infinite`,
                                        animationPlayState: runnerState[index]}
               return <div  key={index} style={animationStyle} className='timerunners'/>
            })}           
        </div>
    )
}

export default ItenaryClock
