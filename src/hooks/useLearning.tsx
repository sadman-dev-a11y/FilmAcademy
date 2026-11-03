import { createContext,useCallback,useContext,useRef,useState,type ReactNode } from 'react';
import { emptyState,KEY,parseState,readState,type LearningState } from '../lib/store';
type Learning={state:LearningState;warning:string;update:(f:(s:LearningState)=>LearningState)=>void;importData:(raw:string)=>void;reset:()=>void};
const Context=createContext<Learning|null>(null);
export function LearningProvider({children}:{children:ReactNode}){
 const [initial]=useState(readState);const [state,setState]=useState(initial.state);const current=useRef(state);const [warning,setWarning]=useState(initial.warning);
 const commit=useCallback((next:LearningState)=>{const stamped={...next,updatedAt:new Date().toISOString()};try{localStorage.setItem(KEY,JSON.stringify(stamped));setWarning('')}catch{setWarning('Browser storage is unavailable or full. Changes are held in memory; export a backup before leaving.')}current.current=stamped;setState(stamped)},[]);
 const update=useCallback((f:(s:LearningState)=>LearningState)=>commit(f(current.current)),[commit]);
 return <Context.Provider value={{state,warning,update,importData:raw=>commit(parseState(raw)),reset:()=>commit(emptyState())}}>{children}</Context.Provider>;
}
export function useLearning(){const c=useContext(Context);if(!c)throw new Error('LearningProvider required');return c}
