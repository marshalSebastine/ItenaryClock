import './ItenaryClock.styles.css';

const ItenaryClock = () => {
    let numberofchildren = 3
    let placeAtAngleGap = 360/numberofchildren
    let childrenDummyList = ['child1','child2','child3']
    let clockradius = 450/2
    return(
        <div className='itenaryclock_wrapper'>
            {childrenDummyList.map((child,index) => {
               let transformstyle =  {transform: `rotate(${index*placeAtAngleGap}deg) translate(calc(var(--circlerad)*-1px)) rotate(${index*placeAtAngleGap*-1}deg)`}
               return <div style={transformstyle} className='timerunners'/>
            })}           
        </div>
    )
}

export default ItenaryClock
