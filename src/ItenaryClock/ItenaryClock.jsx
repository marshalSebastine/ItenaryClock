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


function complementaryColor(rgbColor) {
    const [r, g, b] = rgbColor;
    const compR = 255 - r/0.5;
    const compG = 255 - g/0.5;
    const compB = 255 - b/0.5;
    return [compR, compG, compB];
}

function generateRandomRGB() {
    return [Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256)];
}
function getColorCombinationString([r,g,b]){
    return `rgb(${r},${g},${b})`

}

const ItenaryClock = () => {
    let numberofchildren = 3
    let placeAtAngleGap = 360 / numberofchildren
    let childrenDummyList = ['child1', 'child2', 'child3']
    let runnerStateIndex = useRef(0)
    let bgstyle = useRef()
    let runnerColor = useRef()
    let runnerRingColor = useRef()
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
        const baseColor = generateRandomRGB();
        const compColor = complementaryColor(baseColor);
        const baseColorString = getColorCombinationString(baseColor)
        const compColorstring = getColorCombinationString(compColor)
        runnerColor.current = baseColorString
        runnerRingColor.current = compColorstring
        bgstyle.current = {
            background: `${baseColorString}`,  /* fallback for old browsers */
            background: `-webkit-radial-gradient(closest-side,${baseColorString} , ${compColorstring})`,  /* Chrome 10-25, Safari 5.1-6 */
            background: `radial-gradient(closest-side, ${baseColorString}, ${compColorstring})` /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
        }
    }, [])

    //side effect for changing state of animation play
    useEffect(() => {
        setRunnerStates((oldState) => {
            let animationPlayStateCss = (animationState) ?  animationStatus.play : animationStatus.pause
            let newState = oldState.map((state,indx) => {
                if (indx == runnerStateIndex.current){
                    return `moveincircle${runnerStateIndex.current} 5s ${animationPlayStateCss} linear`
                }
                return 'initial'
            })
            return newState
        })
    },[animationState])

    function handleAnimationEnd(evnt, indx) {
        // change background
        const baseColor = generateRandomRGB();
        const compColor = complementaryColor(baseColor);
        const baseColorString = getColorCombinationString(baseColor)
        const compColorstring = getColorCombinationString(compColor)
        runnerColor.current = baseColorString
        runnerRingColor.current = compColorstring
        bgstyle.current = {
            background: `${baseColorString}`,  /* fallback for old browsers */
            background: `-webkit-radial-gradient(closest-side,${baseColorString} , ${compColorstring})`,  /* Chrome 10-25, Safari 5.1-6 */
            background: `radial-gradient(closest-side, ${baseColorString}, ${compColorstring})` /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
        }
        //trigger runner
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
            <div style={bgstyle.current}  className='itenaryclock_innercircle'>
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
                        backgroundColor: runnerColor.current,
                    }
                    return (
                        <div key={index}>
                            <div style={animationStyle}
                                onAnimationEnd={(evnt) => { handleAnimationEnd(evnt, index) }}
                                className='timerunner' >
                                <div style={{backgroundColor: runnerColor.current}} className={(runnerStateIndex.current === index) ? 'pulsating-circle-before' : ''} />
                                <div style={{backgroundColor: runnerColor.current}} className={(runnerStateIndex.current === index) ? 'pulsating-circle-after' : ''} />
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
