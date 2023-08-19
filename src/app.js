import React from "react";
import ItenaryClock from "./ItenaryClock/ItenaryClock";
import { Session } from "./ItenaryClock/ItenaryClock";
const App = () =>{
    return (
        <ItenaryClock>
            <Session period={'am'} hh={8}     
                      mm={10}
                      tasklist={['learn about surf board',
                        'learn basic surfing terminology',
                        'learn basics of type of waves and ocean safety']}
                     taskheading={'Learn Surfing basics'} />
            <Session period={'am'} hh={10}     
                      mm={0}
                      tasklist={['Surfing Practise',
                        'learn basic surfing balance and commands',
                        'practice,practice and practise']}
                     taskheading={'Learn Surfing basics'} />
            <Session period={'pm'} hh={5}     
                      mm={30}
                      tasklist={['Surfing Practise along wth pros',
                        'music dance and socializing time']}
                     taskheading={'Evening Surfing Session'} />
        </ItenaryClock>
    )
}

export default App