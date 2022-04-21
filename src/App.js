import './App.css';
import React, { useState, useEffect} from 'react';
import ReactDOM from "react-dom";
import MindElixir, { E } from "mind-elixir";
//import {writeJsonFile} from 'write-json-file';
import painter from 'mind-elixir/dist/painter';
import PptxGenJS from "pptxgenjs";
import { Button, Form } from 'react-bootstrap';


//const pptx = new PptxGenJS();

var mindstring = '';

var mindhistory = [];
var mindhistoryIndex = [];

var mindundo = [];

let datajson = '';

function App() {

  //const [update, setUpdate] = useState();

  let options = {
    el: "#map",
    direction: MindElixir.LEFT,
    //data: data,
    data: MindElixir.new("new topic"),
    draggable: true,
    contextMenu: true,
    toolBar: true,
    nodeMenu: true,
    keypress: true,
    allowUndo: true,
    contextMenuOption: {
      focus: true,
      link: true,
      extend: [
        {
          name: 'Node edit',
          onclick: () => {
            
          },
        },
      ],
    },
  }

  //let mind = new MindElixir(options);
  let mind = null;

  useEffect(() => {

    mind = new MindElixir(options);

    //setMind(mind);
    //mind.init();

    mind.initSide();

    mind.getAllDataString();

    // get a node
    //console.log(mind.getAllDataMd());
    //dataUpdate(mind.getAllData());

    mind.bus.addListener('operation', operation => {

      //console.log(mind.getAllDataString());
      console.log(operation);
      mindstring = mind.getAllData();

    })
    mind.bus.addListener('selectNode', node => {
      //console.log(node)
    })

    mind.bus.addListener('expandNode', node => {
      //console.log('expandNode: ', node)
    })
  },[]);


  //Export JSON
  const exportData = () => {
    mindstring = mind.getAllData();
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(mindstring)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "data.json";

    link.click();
  };

  //Export Image
  const paint = () => {
    //console.log(mind.getAllDataMd());
    painter.exportPng(mind,'picture');
    //const fs = require('fs');

  }

  //Import JSON then convert to mindmap
  const importData = (datajson) => {

    var obj = JSON.parse(datajson);

    let optionsdata = {
      el: "#map",
      direction: MindElixir.LEFT,
      data: obj,
      //data: MindElixir.new("new topic"),
      draggable: true,
      contextMenu: true,
      toolBar: true,
      nodeMenu: true,
      keypress: true, //true 
      allowUndo: true, //ทำ undo, redo manual เอง
      contextMenuOption: {
        focus: true,
        link: true,
        extend: [
          {
            name: 'Undo',
            onclick: () => {
              
            },
          },
        ],
      },
    }

    //console.log(data.nodeData.id);

    mind = new MindElixir(optionsdata);

    mind.initSide();

    mind.getAllDataString();

    mindstring = mind.getAllData();

    mind.bus.addListener('operation', operation => {

      //console.log(operation);
      mindstring = mind.getAllData();

      console.log(mindstring);

      //mindhistory.push(operation);
      //mindhistory = mind.history
      console.log(mind.history);

    })
    mind.bus.addListener('selectNode', node => {
      //console.log(node)
    })

    mind.bus.addListener('expandNode', node => {
      //console.log('expandNode: ', node)
    })
  }

  const undo = () => {

    if (mindhistory.length === 0 ){
      return 'No undo left';
    }

    mindhistoryIndex = mindhistory.length-3;
    //var mind1 = mindhistory[mindhistoryIndex];
    //console.log(JSON.stringify(mind1))
    //console.log((mind1))
    
    var undoOperation = mind.history.pop();
    //if (!operation) return
    //console.log(mindhistory);
    console.log(undoOperation);
    //mindundo.push(undoOperation);
    //console.log(mindundo)

    if (undoOperation.name === 'finishEdit'){
      //var idTemp = undoOperation.obj.id
      //var originName = undoOperation.origin
      //console.log(idTemp);
      //console.log(originName)
      mind.setNodeTopic(E(undoOperation.obj.id), undoOperation.origin)
      //console.log(mind)

    }

  }

  const redo = () => {
    
    var redoOperation = mindundo.pop();
    mindhistory.push(redoOperation);
    console.log(redoOperation);
    mind.setNodeTopic(E(redoOperation.obj.id), redoOperation.obj.topic)

  }

  const FrontPagePPTX = (obj,pptx) => {
      if (obj.length === 0){
  
        //slide.addText(obj.topic, { x: 10, y: 10, w: 10, fontSize: 36, fill: { color: "F1F1F1" }, align: "center" })
  
        return;
  
      } else {

        let slide = pptx.addSlide({ masterName: "FontPage" });
        slide.addText(obj, {x:0.5, y: 2, h: 1, w: "90%", fontFace: "Courier", fontWeight: 'bold', fontSize: 72, align: "center", bold:true })
        slide.background = {path : 'https://i2.wp.com/files.123freevectors.com/wp-content/original/125250-blue-and-white-water-background.jpg?w=800&q=95'}
      
      }
  }

  //Export to powerpoint
  const recursive = (obj,pptx) => {
    //var mindObj = mind.getAllData()
    //console.log(obj.topic);
    

    if (!('children' in obj) || obj.children.length === 0){

      //slide.addText(obj.topic, { x: 10, y: 10, w: 10, fontSize: 36, fill: { color: "F1F1F1" }, align: "center" })

      return;

    } else {

      let slide = pptx.addSlide();
      slide.addText(obj.topic, {x:0.5, y:"5%" , h: 1, w: "90%", fontFace: "Courier", fontWeight: 'bold', fontSize: 24, align: "center", bold:true })

      var strcount = 0;
      var childrentext = []
      var checkBullet = 0;

      for (var i = 0 ; i < obj.children.length ; i++){

        console.log(obj.children[i].topic);
        console.log('checkBullet '+ checkBullet);

        strcount+=obj.children[i].topic.length;
        //slide.addText(obj.children[i].topic+(i+1)/2, { x: 0.5, y: (i+1)/2, h: 1, w: 9, fontSize: 14, align: "left" ,bullet: true})
        
        if ( (i+1) % 11 == 0 ) {
          console.log('over 11 bullet')
          slide.addText(childrentext, { x: 0.5, y: "25%", w: "90%", h: 4 ,valign:"top"});

          slide = pptx.addSlide();
          slide.addText(obj.topic + ' (ต่อ)', {x:0.5, y:"5%" , h: 1, w: "90%", fontFace: "Courier", fontWeight: 'bold', fontSize: 24, align: "center", bold:true })


          childrentext = [];
          childrentext.push({ text: obj.children[i].topic, options: {fontFace: "Courier", fontSize: 14, bullet: true, breakLine: true  } })
          strcount = 0;
          checkBullet = 0;

        } else if ( strcount > 1000 ) {

          if ( childrentext.length == 0 ){ //เป็นลูกตัวแรกแล้วใหญ่เกินกล่อง ให้ทำตั้งแต่หน้าแรก

            var firstslideText = obj.children[i].topic.slice(0,1000);
            slide.addText(firstslideText, { x: 0.5, y: "25%", w: "90%", h: 4 ,valign:"top", fontFace: "Courier", fontSize: 14, bullet: true, breakLine: true  });
            var whilecountIf = Math.ceil(obj.children[i].topic.length / 1000) - 1;

            var slicenumStart = 1001;
            var slicenumEnd = 2000;

            while ( whilecountIf !== 0 ) {

              let newSlide = pptx.addSlide();
              newSlide.addText(obj.topic + ' (ต่อ)', {x:0.5, y:"5%" , h: 1, w: "90%", fontFace: "Courier", fontWeight: 'bold', fontSize: 24, align: "center", bold:true })
              
              var topicSlice = obj.children[i].topic.slice(slicenumStart,slicenumEnd);
              if (slicenumStart == 0){
                newSlide.addText(topicSlice, { x: 0.5, y: "25%", w: "90%", h: 4 ,valign:"top",fontFace: "Courier", fontSize: 14, bullet: true, breakLine: true  });
              } else {
                newSlide.addText(topicSlice, { x: 0.5, y: "25%", w: "90%", h: 4 ,valign:"top",fontFace: "Courier", fontSize: 14, breakLine: true  });
              }
              whilecountIf -= 1;
              slicenumStart = slicenumEnd;
              if( Math.floor(obj.children[i].topic.length / 1000) !== 0 ) {
                slicenumEnd = slicenumEnd+1000;
              } else {
                slicenumEnd = obj.children[i].topic.length;    
              }    
            }

          } else { //ให้ทำหน้าต่อไป (หัวข้อมี (ต่อ) เติมท้าย)

            slide.addText(childrentext, { x: 0.5, y: "25%", w: "90%", h: 4 ,valign:"top", fontFace: "Courier", fontSize: 14, bullet: true, breakLine: true  });

            var whilecount = Math.ceil(obj.children[i].topic.length / 1000); //หารแล้วปัดขึ้น (2.3 => 3)
            console.log(whilecount);
            var slicenumStart = 0;
            var slicenumEnd = 1000;

            while ( whilecount !== 0 ) {

              let newSlide = pptx.addSlide();
              newSlide.addText(obj.topic + ' (ต่อ)', {x:0.5, y:"5%" , h: 1, w: "90%", fontFace: "Courier", fontWeight: 'bold', fontSize: 24, align: "center", bold:true })
              
              var topicSlice = obj.children[i].topic.slice(slicenumStart,slicenumEnd);
              if (slicenumStart == 0){
                newSlide.addText(topicSlice, { x: 0.5, y: "25%", w: "90%", h: 4 ,valign:"top",fontFace: "Courier", fontSize: 14, bullet: true, breakLine: true  });
              } else {
                newSlide.addText(topicSlice, { x: 0.5, y: "25%", w: "90%", h: 4 ,valign:"top",fontFace: "Courier", fontSize: 14, breakLine: true  });
              }
              whilecount -= 1;
              slicenumStart = slicenumEnd;
              if( Math.floor(obj.children[i].topic.length / 1000) !== 0 ) {
                slicenumEnd = slicenumEnd+1000;
              } else {
                slicenumEnd = obj.children[i].topic.length;    
              }    
            }
          }

          childrentext = [];
          strcount = 0;

          if ( i !== obj.children.length-1 ){

            slide = pptx.addSlide();
            slide.addText(obj.topic + ' (ต่อ)', {x:0.5, y:"5%" , h: 1, w: "90%", fontFace: "Courier", fontWeight: 'bold', fontSize: 24, align: "center", bold:true })
            checkBullet = 0;
          }

        } else {
          childrentext.push({ text: obj.children[i].topic, options: {fontFace: "Courier", fontSize: 14, bullet: true, breakLine: true  } })
          checkBullet += 1;
        }

      }

      slide.addText(childrentext, { x: 0.5, y: "25%", w: "90%", h: 4 ,valign:"top"});

      for (var j = 0 ; j < obj.children.length ; j++){
        //console.log(obj.children[j]);
        recursive(obj.children[j],pptx);
      }

    }
  }

  const onExport = () => {
    var pptx = new PptxGenJS();
    var mindObj = mind.getAllData();
    //console.log(mindObj.nodeData);
    FrontPagePPTX(mindObj.nodeData.topic, pptx);
    recursive(mindObj.nodeData,pptx);

    

    //let slide = pptx.addSlide();
    //slide.addText("React Demo!");

    pptx.writeFile({ fileName: "mindmap.pptx" });
  };

  //Choose File
  const readJSON = (e) => {
      const fileReader = new FileReader();
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = e => {
        console.log("e.target.result", e.target.result);
        datajson = e.target.result;
        importData(datajson);
      };
    };

  return (
    <>
    <div>
      <Form.Group controlId="formFile" className="mb-3">
        <Form.Label>Import JSON File</Form.Label>
        <Form.Control type="file" onChange={readJSON}/>
      </Form.Group>
    </div>
    <div >
      <Button variant="outline-secondary" onClick={() => paint()}>Export PNG</Button>{' '}
      <Button variant="outline-success" onClick={() => exportData()}>Export JSON</Button>{' '}
      <Button variant="outline-danger" onClick={() => onExport()}>Export PPTX</Button>
    </div>
    <div id="map" style={{ height: "800px", width: "100%" }} />
    </>
  );
}

export default App;