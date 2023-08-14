import { useEffect, useRef, useState } from 'react';
import './ItenaryClock.styles.css';

// check whether yout slide is currently displayed by checking presentSlide === slideIndex
const Session = ({presentSlide,slideIndex, heading}) => {
   
    return(
        <div  style={(presentSlide === slideIndex) ? {animation: 'slowlyappear 1s forwards'} : {opacity: 0}}
              className='session-wrapper'>
            <p className='session-time'> 8:00 <span className='session-am-pm'>am</span></p>
            <span className='session-heading'>{heading} </span>
            <ul className='session-todo-list'>
                <li key={1}>take out leaves</li>
            </ul>
        </div>
    )
}




const ItenaryClock = () => {
    let numberofchildren = 3
    let placeAtAngleGap = 360 / numberofchildren
    let childrenDummyList = ['child1', 'child2', 'child3']
    let runnerStateIndex = useRef(0)
    const defaultRunnerStates = []
    const animationStatus = {
        'play': 'running',
        'pause': 'paused',
    }
    const [animationState,setAnimationState] = useState(true)

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
            runnerStateIndex.current = (indx + 1)
            triggerAnimationState(indx + 1)
        }
    }

    function handleContentClick(evnt,index) {
            setAnimationState(!animationState)
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
                        animation: runnerState[index],
                        animationPlayState: (animationState) ? animationStatus.play : animationStatus.pause
                    }
                    return (
                        <div key={index}>
                            <div style={animationStyle}
                                onAnimationEnd={(evnt) => { handleAnimationEnd(evnt, index) }}
                                className='timerunner' >
                                <div className={(runnerStateIndex.current === index) ? 'pulsating-circle-before' : ''} />
                                <div className={(runnerStateIndex.current === index) ? 'pulsating-circle-after' : ''} />
                            </div>
                            <div onClick={handleContentClick} className='clockcontent-container'>
                                <Session presentSlide={runnerStateIndex.current} heading={child}
                                         slideIndex={index}/>
                            </div>
                        </div>)
                })}
            </div>
        </div>
    )
}

export default ItenaryClock
