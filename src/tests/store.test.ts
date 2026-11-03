import { describe,it,expect,vi } from 'vitest';
import { courses,lessons } from '../data/curriculum';
import { glossary } from '../data/glossary';
import { emptyState,parseState,grade,earned,percent,moveShot,newShot,newBoard,parseBoard,KEY,readState } from '../lib/store';
describe('Curriculum integrity',()=>{
 it('ships six unique complete courses and eighteen lessons',()=>{expect(courses).toHaveLength(6);expect(lessons).toHaveLength(18);expect(new Set(lessons.map(l=>l.id)).size).toBe(18);expect(glossary.length).toBeGreaterThanOrEqual(35)});
 for(const c of courses)it(`${c.id} has substantial teaching and explainable questions`,()=>{expect(c.lessons.length).toBeGreaterThanOrEqual(3);expect(c.quiz.length).toBeGreaterThanOrEqual(5);for(const l of c.lessons){expect(l.sections.flatMap(s=>s.text.split(/\s+/)).length).toBeGreaterThan(250);expect(l.checks).toHaveLength(2);expect(l.terms).toHaveLength(3);expect(l.task.length).toBeGreaterThan(40);expect(l.objectives.length).toBeGreaterThanOrEqual(2)}for(const q of c.quiz){expect(q.correct).toBeLessThan(q.options.length);expect(q.explanation.length).toBeGreaterThan(20)}});
});
describe('Scoring and completion',()=>{
 const c=courses[0];const correct=c.quiz.map(q=>q.correct);
 it('grades actual answers, including partial and wrong attempts',()=>{expect(grade(c.quiz,correct)).toBe(100);expect(grade(c.quiz,correct.map((x,i)=>i===0?(x+1)%c.quiz[i].options.length:x))).toBe(80);expect(grade(c.quiz,[])).toBe(0)});
 it('requires every lesson and a threshold quiz',()=>{const s=emptyState();expect(earned(c,s)).toBe(false);s.completed=c.lessons.map(l=>l.id);expect(percent(c,s)).toBe(100);expect(earned(c,s)).toBe(false);s.attempts=[{courseId:c.id,answers:correct,score:100,date:new Date().toISOString()}];expect(earned(c,s)).toBe(true);s.completed.pop();expect(earned(c,s)).toBe(false)});
 it('does not erase an earlier passing attempt after a retry',()=>{const s=emptyState();s.completed=c.lessons.map(l=>l.id);s.attempts=[{courseId:c.id,answers:correct,score:100,date:new Date().toISOString()},{courseId:c.id,answers:[1,0,0,0,0],score:0,date:new Date().toISOString()}];expect(earned(c,s)).toBe(true)});
});
describe('Validated persistence',()=>{
 it('round-trips notes, quizzes, boards and preferences',()=>{const s=emptyState();s.completed=[lessons[0].id];s.notes[lessons[0].id]='Observe the frame';s.boards=[{...newBoard(),shots:[newShot()]}];s.motion='reduce';localStorage.setItem(KEY,JSON.stringify(s));expect(readState().state).toEqual(s)});
 it('migrates v1 to the current schema',()=>{const s={...emptyState(),schemaVersion:1};expect(parseState(JSON.stringify(s)).schemaVersion).toBe(2)});
 it.each(['{','null','[]','{"schemaVersion":9}'])('rejects corrupt input %s',raw=>expect(()=>parseState(raw)).toThrow());
 it('rejects oversized data',()=>expect(()=>parseState('x'.repeat(2_000_001))).toThrow());
 it('rejects unknown lesson IDs',()=>expect(()=>parseState(JSON.stringify({...emptyState(),completed:['invented']}))).toThrow());
 it('rejects manipulated scores',()=>{const c=courses[0];expect(()=>parseState(JSON.stringify({...emptyState(),attempts:[{courseId:c.id,answers:c.quiz.map(q=>q.correct),score:0,date:new Date().toISOString()}]}))).toThrow()});
 it('retains corrupt stored data and exposes a warning',()=>{localStorage.setItem(KEY,'broken');expect(readState().warning).toContain('not been overwritten');expect(localStorage.getItem(KEY)).toBe('broken')});
 it('handles inaccessible browser storage',()=>{const spy=vi.spyOn(Storage.prototype,'getItem').mockImplementation(()=>{throw new Error('denied')});expect(readState().warning).toBeTruthy();spy.mockRestore()});
});
describe('Storyboard operations',()=>{
 it('reorders without mutating input and respects boundaries',()=>{const a=newShot(),b=newShot(),c=newShot();const shots=[a,b,c];expect(moveShot(shots,0,2)).toEqual([c,b,a]);expect(shots).toEqual([a,b,c]);expect(moveShot(shots,0,-1)).toEqual(shots)});
 it('round-trips a board as a new identity',()=>{const b={...newBoard(),shots:[newShot()]};const imported=parseBoard(JSON.stringify({schemaVersion:1,board:b}));expect(imported.id).not.toBe(b.id);expect(imported.shots).toEqual(b.shots)});
 it('rejects invalid duration and duplicate identifiers',()=>{const shot=newShot();const b={...newBoard(),shots:[shot,shot]};expect(()=>parseBoard(JSON.stringify({schemaVersion:1,board:b}))).toThrow();b.shots=[{...shot,duration:-5}];expect(()=>parseBoard(JSON.stringify({schemaVersion:1,board:b}))).toThrow()});
});
