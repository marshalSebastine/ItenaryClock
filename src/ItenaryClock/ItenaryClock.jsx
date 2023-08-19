import { useEffect, useRef, useState } from 'react';
import './ItenaryClock.styles.css';

// check whether yout slide is currently displayed by checking presentSlide === slideIndex
export const Session = ({period,hh,mm,taskheading,tasklist}) => {
    

    return(
        <div className='session-wrapper'>
            <p className='session-time'> {`${hh} : ${mm}`} <span className='session-am-pm'>{`${period}`}</span></p>
            <span className='session-heading'>{taskheading}</span>
            <ul className='session-todo-list'>
                {tasklist.map((task,index) => {
                    return(
                        <li key={index}>
                            {task}
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

const ItenaryClock = ({children}) => {
    if(!Array.isArray(children)){
      children = [children]   
    }
    let numberofchildren = children.length
    let placeAtAngleGap = 360 / numberofchildren
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

    for(let i = 0; i < numberofchildren; i++){
        defaultRunnerStates.push('initial')
    }
    const [runnerState, setRunnerStates] = useState(defaultRunnerStates);

    useEffect(() => {
        setTimeout(() => {
            triggerAnimationState(0)
        }, 500)
        getColorCombo()
    }, [])

    //side effect for changing state of animation play
    useEffect(() => {
        setRunnerStates((oldState) => {
            let animationPlayStateCss = (animationState) ?  animationStatus.play : animationStatus.pause
            let animationCount = (numberofchildren == 1) ? 'infinite' : 1
            let newState = oldState.map((state,indx) => {
                if (indx == runnerStateIndex.current){
                    return `moveincircle${runnerStateIndex.current} ${animationCount} 5s linear ${animationPlayStateCss} `
                }
                return 'initial'
            })
            return newState
        })
    },[animationState])
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

    function getColorCombo(){
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
    }

    function handleAnimationEnd(evnt, indx) {
        getColorCombo()
        //trigger runner
        if (indx == numberofchildren - 1) {
            runnerStateIndex.current = 0
            triggerAnimationState(0)
        } else {
            runnerStateIndex.current = (indx + 1)
            triggerAnimationState(indx + 1)
        }
    }
    function handleRunnerClick(index){
        return (_evnt) => {
            runnerStateIndex.current = index
            getColorCombo()
            triggerAnimationState(index)
        }
    }
    function triggerAnimationState(forChildIndx) {
        setRunnerStates(oldRunnerState => {
            let newstate = oldRunnerState.map((state, indx) => {
                let animationCount = (numberofchildren == 1) ? 'infinite' : 1
                if (indx === forChildIndx) {
                    let animationname = `moveincircle${indx}`;
                    return `${animationname} ${animationCount} 5s linear`
                }
                return 'initial'
            })
            return (newstate)
        })
    }
    return (
        <div className='itenaryclock_wrapper'>
            <div style={bgstyle.current}  className='itenaryclock_innercircle'>
                {children.map((child, index) => {
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
                        backgroundColor: (runnerStateIndex.current == (index)) ? 'transparent' : runnerColor.current,
                        opacity: (runnerStateIndex.current == (index)) ? 1 : 0.67
                    }
                    return (
                        <div key={index}>
                            <div style={animationStyle}
                                onClick={handleRunnerClick(index)}
                                onAnimationEnd={(evnt) => { handleAnimationEnd(evnt, index) }}
                                className='timerunner' >
                                <div style={{backgroundColor: runnerColor.current}} className={(runnerStateIndex.current === index) ? 'pulsating-circle-before' : ''} />
                                <div style={{backgroundColor: runnerColor.current}} className={(runnerStateIndex.current === index) ? 'pulsating-circle-after' : ''} />
                            </div>
                            <div onClick={(_evnt) => {setAnimationState(!animationState)}}
                                 style={(index === runnerStateIndex.current) ? {animation: 'slowlyappear 1s linear'}: {display: 'none'}}
                                 className='clockcontent-container'>
                                {child}
                            </div>
                        </div>)
                })}
            </div>
        </div>
    )
}

export default ItenaryClock
