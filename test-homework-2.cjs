const assert=require('node:assert/strict');
const first=require('./homework-bank.js');
const engine=require('./homework-2-engine.js');
const {bank,startExam,submit,setPaused,publicState}=engine;
const sources=[...Array.from({length:17},(_,i)=>i+75),...Array.from({length:6},(_,i)=>i+10),...Array.from({length:10},(_,i)=>i+23)];
const mathKeys=['About one quarter of the days had 12 to 16 fares.','y = (2/3)x','18,316','-1/49','-1.181818...','200','1/2','-1 <= x <= 2','10.67','5.5x - 5','Group P has more members at least 17 years old than Group Q.','1/2','16 pretzels and 12 raisins','35x + 10','45pi square inches','-3.6','8 centimeters'];
const englishKeys=[2,1,3,3,2,1,0,0,3,3,1,2,1,3,1,3];
assert.equal(bank.questions.length,33);
assert.deepEqual(bank.questions.map(q=>q.source),sources);
assert.equal(new Set(bank.questions.map(q=>q.id)).size,33);
assert.ok(bank.questions.every(q=>!first.questions.some(other=>other.id===q.id)));
assert.equal(bank.questions.filter(q=>q.subject==='Math').length,17);
assert.equal(bank.questions.filter(q=>q.subject==='English').length,16);
bank.questions.slice(0,17).forEach((q,i)=>assert.equal(q.choices[q.answer],mathKeys[i],q.id));
bank.questions.slice(17).forEach((q,i)=>assert.equal(q.answer,englishKeys[i],q.id));
for(const q of bank.questions){
  assert.equal(q.choices.length,4,q.id);
  assert.equal(new Set(q.choices).size,4,q.id);
  assert.ok(q.explanation,q.id);
  if(q.subject==='English')assert.ok(q.passage?.paragraphs.length,q.id);
}
assert.equal(bank.passages['nez-perce'].paragraphs.length,28);
const seen=new Set();
for(let pattern=0;pattern<32;pattern++){
  const state=startExam('Student',60,1000);
  seen.add(JSON.stringify(state.orders));
  for(let i=0;i<33;i++){
    const current=publicState(state,2000+i*1000);
    const q=bank.questions.find(item=>item.id===current.current.id);
    assert.equal(current.current.subject,i<17?'Math':'English');
    assert.ok(!('answer' in current.current));
    const right=pattern===0||Boolean((pattern>>(i%5))&1);
    const selected=right?q.answer:(q.answer+1)%4;
    submit(state,{questionId:q.id,choice:state.orders[q.id].indexOf(selected),requestId:pattern+'-'+i},2000+i*1000);
  }
  const report=publicState(state,40000).report;
  assert.equal(report.rows.length,33);
  assert.equal(report.total,pattern===0?33:report.rows.filter(row=>row.correct).length);
  const letters=[0,0,0,0];report.rows.forEach(row=>letters['ABCD'.indexOf(row.answerLetter)]++);
  assert.ok(letters.every(count=>count===8||count===9));
}
assert.ok(seen.size>30);
let state=startExam('Pause',1,1000);
setPaused(state,true,11000);
assert.equal(publicState(state,60000).status,'paused');
assert.equal(publicState(state,60000).remainingMs,50000);
setPaused(state,false,71000);
assert.equal(state.deadline,121000);
assert.equal(state.pauseCount,1);
assert.equal(publicState(state,121000).report.rows.length,33);
assert.equal(publicState(state,121000).report.unanswered,33);
console.log('PASS: Quiz #2 has 33 unused items, checked answer keys, independent adaptive orders, balanced choices, pause and timeout reports.');
