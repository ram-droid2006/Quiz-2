const assert=require('node:assert/strict');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {spawn}=require('node:child_process');
const {chromium}=require('playwright');
const bank=require('./homework-2-bank.js');
const output=process.env.BRCDC_QA_DIR||'/tmp/brcdc-homework-2-qa';
fs.mkdirSync(output,{recursive:true});
const dataDir=fs.mkdtempSync(path.join(os.tmpdir(),'brcdc-homework-2-'));
let child,browser;
(async()=>{
  child=spawn(process.execPath,['server.js'],{cwd:__dirname,env:{...process.env,PORT:'0',HOST:'127.0.0.1',BRCDC_DATA_DIR:dataDir},stdio:['ignore','pipe','pipe']});
  const base=await new Promise((resolve,reject)=>{
    const timer=setTimeout(()=>reject(new Error('Server start timed out')),10000);
    child.stdout.on('data',chunk=>{const match=String(chunk).match(/http:\/\/127\.0\.0\.1:\d+/);if(match){clearTimeout(timer);resolve(match[0]);}});
    child.on('error',reject);
    child.on('exit',code=>reject(new Error('Server exited with '+code)));
  });
  browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
  const context=await browser.newContext({viewport:{width:1440,height:900},acceptDownloads:true});
  const page=await context.newPage(),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto(base+'/homework-2/');
  await page.locator('#start-button').waitFor({state:'visible'});
  assert.equal(await page.title(),'BRCDC | Homework Quiz #2');
  await page.locator('#student-name').fill('Quiz Two QA');
  await page.locator('#start-button').click();
  await page.locator('#exam-screen').waitFor({state:'visible'});
  const session=()=>context.request.get(base+'/homework-2/api/session').then(response=>response.json());
  assert.equal((await context.request.get(base+'/homework-1/api/session')).status(),200);
  assert.equal((await context.request.get(base+'/homework-1/api/session').then(response=>response.json())).status,'not-started');
  await page.locator('#pause-button').click();
  await page.locator('#paused-screen').waitFor({state:'visible'});
  assert.equal((await session()).status,'paused');
  await page.reload();
  await page.locator('#paused-screen').waitFor({state:'visible'});
  await page.locator('#resume-button').click();
  await page.locator('#exam-screen').waitFor({state:'visible'});
  let chartSeen=false,storySeen=false;
  for(let i=0;i<33;i++){
    const state=await session(),question=bank.questions.find(q=>q.id===state.current.id);
    if(question.diagram&&!chartSeen){
      await page.reload();await page.locator('.math-diagram svg').waitFor({state:'visible'});
      assert.equal(await page.locator('.math-diagram svg').count(),1);
      await page.screenshot({path:output+'/math-chart.png'});chartSeen=true;
    }
    if(question.group==='nez-perce'&&!storySeen){
      await page.reload();await page.locator('#passage-panel').waitFor({state:'visible'});
      assert.ok((await page.locator('#passage').textContent()).includes('Wat-ku-ese'));
      await page.screenshot({path:output+'/reading-desktop.png'});
      for(const width of [1440,700,390,320]){
        await page.setViewportSize({width,height:840});
        assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,'Overflow at '+width);
      }
      await page.setViewportSize({width:390,height:840});await page.screenshot({path:output+'/reading-mobile.png'});
      await page.setViewportSize({width:1440,height:900});storySeen=true;
    }
    const choice=state.current.choices.indexOf(question.choices[question.answer]);
    const response=await context.request.post(base+'/homework-2/api/answer',{data:{questionId:question.id,choice,requestId:'qa-'+i}});
    assert.equal(response.status(),200,question.id);
  }
  assert.ok(chartSeen&&storySeen);
  await page.reload();await page.locator('#results-screen').waitFor({state:'visible'});
  assert.equal(await page.locator('.answer-row').count(),33);
  assert.equal((await session()).report.total,33);
  await page.locator('#result-filter').selectOption('flagged');
  const downloadPromise=page.waitForEvent('download');
  await page.locator('#download-button').click();
  const download=await downloadPromise;
  assert.ok(download.suggestedFilename().includes('Homework-2'));
  const pdfPath=output+'/homework-2-results.pdf';await download.saveAs(pdfPath);
  assert.ok(fs.readFileSync(pdfPath).subarray(0,4).toString()==='%PDF');
  assert.deepEqual(errors,[]);
  console.log('PASS: Quiz #2 route, independent session, pause/reload, chart, long passage, responsive widths, all 33 answers, results PDF. Artifacts: '+output);
})().catch(error=>{console.error(error);process.exitCode=1;}).finally(async()=>{
  if(browser)await browser.close();
  if(child){child.kill('SIGTERM');const timer=setTimeout(()=>child.kill('SIGKILL'),3000);timer.unref();}
});
