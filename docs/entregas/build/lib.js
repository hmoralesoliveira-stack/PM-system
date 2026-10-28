const fs=require('fs');
const d=require('docx');
const {Paragraph,TextRun,Table,TableRow,TableCell,WidthType,ShadingType,BorderStyle,AlignmentType,ImageRun,HeadingLevel,Header,Footer,PageNumber,PageBreak,PageOrientation,LevelFormat,TabStopType}=d;
const NAVY="0B2A4A",BLUE="2F6DB5",LIGHT="EAF1FA",GRAY="F3F4F6",FONT="Arial";
const PORTRAIT_W=9638, LAND_W=15138;
function runs(text,o={}){ // **bold** markup
  const parts=String(text).split(/(\*\*[^*]+\*\*)/g).filter(x=>x!=="");
  return parts.map(p=>p.startsWith("**")?new TextRun({text:p.slice(2,-2),bold:true,font:FONT,size:o.size||21,color:o.color}):new TextRun({text:p,font:FONT,size:o.size||21,bold:o.bold,italics:o.italics,color:o.color}));
}
const P=(t,o={})=>new Paragraph({children:runs(t,o),spacing:{after:o.after??120,before:o.before??0,line:o.line||290},alignment:o.align,keepNext:o.keepNext,indent:o.indent});
const H1=t=>new Paragraph({heading:HeadingLevel.HEADING_1,children:[new TextRun({text:t,font:FONT,bold:true,size:34,color:NAVY})],spacing:{before:120,after:160},border:{bottom:{style:BorderStyle.SINGLE,size:8,color:BLUE,space:4}},keepNext:true});
const H2=t=>new Paragraph({heading:HeadingLevel.HEADING_2,children:[new TextRun({text:t,font:FONT,bold:true,size:26,color:BLUE})],spacing:{before:240,after:100},keepNext:true});
const H3=t=>new Paragraph({heading:HeadingLevel.HEADING_3,children:[new TextRun({text:t,font:FONT,bold:true,size:22,color:NAVY})],spacing:{before:160,after:80},keepNext:true});
const B=(t,o={})=>new Paragraph({numbering:{reference:"bul",level:o.level||0},children:runs(t,o),spacing:{after:70,line:280}});
const N=(t,ref="num")=>new Paragraph({numbering:{reference:ref,level:0},children:runs(t),spacing:{after:70,line:280}});
const brk=()=>new Paragraph({children:[new PageBreak()]});
const bd=(c="BFC5CE")=>({style:BorderStyle.SINGLE,size:4,color:c});
const borders=(c)=>({top:bd(c),bottom:bd(c),left:bd(c),right:bd(c)});
function cell(content,w,o={}){
  const items=Array.isArray(content)?content:[content];
  const kids=items.map(x=>typeof x==="string"?new Paragraph({children:runs(x,{size:o.size||18,bold:o.bold,color:o.color}),spacing:{after:50,line:250},alignment:o.align}):x);
  return new TableCell({children:kids,width:{size:w,type:WidthType.DXA},borders:borders(),shading:o.fill?{type:ShadingType.CLEAR,fill:o.fill,color:"auto"}:undefined,margins:{top:60,bottom:60,left:90,right:90},verticalAlign:o.valign,columnSpan:o.span});
}
function tbl(headers,rows,widths,o={}){
  const total=widths.reduce((a,b)=>a+b,0);
  const trs=[];
  if(headers&&o.hspan) trs.push(new TableRow({tableHeader:true,cantSplit:true,children:[cell(headers[0],total,{fill:NAVY,color:'FFFFFF',bold:true,size:o.hsize||20,span:widths.length})]}));
  else if(headers) trs.push(new TableRow({tableHeader:true,cantSplit:true,children:headers.map((h,i)=>cell(h,widths[i],{fill:NAVY,color:"FFFFFF",bold:true,size:o.hsize||18}))}));
  rows.forEach((r,ri)=>trs.push(new TableRow({cantSplit:o.cantSplit!==false,children:r.map((c,i)=>{
    let fill=ri%2?GRAY:undefined, bold=false;
    if(o.firstColBold&&i===0){bold=true;fill=LIGHT;}
    if(o.fills&&o.fills[ri]&&o.fills[ri][i]) fill=o.fills[ri][i];
    return cell(c,widths[i],{fill,bold,size:o.size||18});
  })})));
  return new Table({width:{size:total,type:WidthType.DXA},columnWidths:widths,rows:trs});
}
function callout(title,lines,w=PORTRAIT_W,color=BLUE,fill=LIGHT){
  const kids=[]; if(title) kids.push(new Paragraph({children:[new TextRun({text:title,bold:true,font:FONT,size:21,color})],spacing:{after:60}}));
  lines.forEach(l=>kids.push(typeof l==="string"?new Paragraph({children:runs(l,{size:20}),spacing:{after:60,line:270}}):l));
  return new Table({width:{size:w,type:WidthType.DXA},columnWidths:[w],rows:[new TableRow({cantSplit:true,children:[new TableCell({children:kids,width:{size:w,type:WidthType.DXA},shading:{type:ShadingType.CLEAR,fill,color:"auto"},borders:{top:bd(fill),bottom:bd(fill),right:bd(fill),left:{style:BorderStyle.SINGLE,size:24,color}},margins:{top:100,bottom:80,left:160,right:140}})]})]});
}
const gap=(a=120)=>new Paragraph({children:[],spacing:{after:a}});
function png(path,widthPx){
  const b=fs.readFileSync(path); let w,h,type="png";
  if(path.endsWith(".png")){w=b.readUInt32BE(16);h=b.readUInt32BE(20);}
  else{type="jpg";let i=2;while(i<b.length){if(b[i]!==0xFF){i++;continue;}const m=b[i+1];if(m>=0xC0&&m<=0xC3){h=b.readUInt16BE(i+5);w=b.readUInt16BE(i+7);break;}i+=2+b.readUInt16BE(i+2);}}
  return new Paragraph({alignment:AlignmentType.CENTER,spacing:{after:80},children:[new ImageRun({type,data:b,transformation:{width:widthPx,height:Math.round(widthPx*h/w)},altText:{title:"Figura",description:"Figura do documento",name:"fig"}})]});
}
const caption=t=>new Paragraph({alignment:AlignmentType.CENTER,spacing:{after:160},children:[new TextRun({text:t,font:FONT,size:17,italics:true,color:"555555"})]});
function hdrftr(left,classif){
  return {
    headers:{first:new Header({children:[new Paragraph({children:[]})]}),default:new Header({children:[new Paragraph({children:[new TextRun({text:"N1 IT | Grupo Stefanini",bold:true,font:FONT,size:17,color:NAVY}),new TextRun({text:"\t"+left,font:FONT,size:17,color:"666666"})],tabStops:[{type:TabStopType.RIGHT,position:9638}],border:{bottom:{style:BorderStyle.SINGLE,size:6,color:BLUE,space:3}}})]})},
    footers:{first:new Footer({children:[new Paragraph({children:[]})]}),default:new Footer({children:[new Paragraph({children:[new TextRun({text:classif,font:FONT,size:16,color:"666666"}),new TextRun({text:"\tPágina ",font:FONT,size:16,color:"666666"}),new TextRun({children:[PageNumber.CURRENT],font:FONT,size:16,color:"666666"}),new TextRun({text:" de ",font:FONT,size:16,color:"666666"}),new TextRun({children:[PageNumber.TOTAL_PAGES],font:FONT,size:16,color:"666666"})],tabStops:[{type:TabStopType.RIGHT,position:9638}]})]})}
  };
}
function hdrftrLand(left,classif){
  const x=hdrftr(left,classif);
  const mk=(pos)=>({headers:{first:new Header({children:[new Paragraph({children:[]})]}),default:new Header({children:[new Paragraph({children:[new TextRun({text:"N1 IT | Grupo Stefanini",bold:true,font:FONT,size:17,color:NAVY}),new TextRun({text:"\t"+left,font:FONT,size:17,color:"666666"})],tabStops:[{type:TabStopType.RIGHT,position:pos}],border:{bottom:{style:BorderStyle.SINGLE,size:6,color:BLUE,space:3}}})]})},footers:{first:new Footer({children:[new Paragraph({children:[]})]}),default:new Footer({children:[new Paragraph({children:[new TextRun({text:classif,font:FONT,size:16,color:"666666"}),new TextRun({text:"\tPágina ",font:FONT,size:16,color:"666666"}),new TextRun({children:[PageNumber.CURRENT],font:FONT,size:16,color:"666666"}),new TextRun({text:" de ",font:FONT,size:16,color:"666666"}),new TextRun({children:[PageNumber.TOTAL_PAGES],font:FONT,size:16,color:"666666"})],tabStops:[{type:TabStopType.RIGHT,position:pos}]})]})}});
  return mk(15138);
}
const styles={default:{document:{run:{font:FONT,size:21}}},paragraphStyles:[
 {id:"Heading1",name:"Heading 1",basedOn:"Normal",next:"Normal",quickFormat:true,run:{size:34,bold:true,font:FONT,color:NAVY},paragraph:{spacing:{before:120,after:160},outlineLevel:0}},
 {id:"Heading2",name:"Heading 2",basedOn:"Normal",next:"Normal",quickFormat:true,run:{size:26,bold:true,font:FONT,color:BLUE},paragraph:{spacing:{before:240,after:100},outlineLevel:1}},
 {id:"Heading3",name:"Heading 3",basedOn:"Normal",next:"Normal",quickFormat:true,run:{size:22,bold:true,font:FONT,color:NAVY},paragraph:{spacing:{before:160,after:80},outlineLevel:2}}]};
const numbering={config:[
 {reference:"bul",levels:[{level:0,format:LevelFormat.BULLET,text:"•",alignment:AlignmentType.LEFT,style:{paragraph:{indent:{left:540,hanging:270}}}},{level:1,format:LevelFormat.BULLET,text:"–",alignment:AlignmentType.LEFT,style:{paragraph:{indent:{left:1000,hanging:270}}}}]},
 {reference:"num",levels:[{level:0,format:LevelFormat.DECIMAL,text:"%1.",alignment:AlignmentType.LEFT,style:{paragraph:{indent:{left:540,hanging:360}}}}]},
 {reference:"num2",levels:[{level:0,format:LevelFormat.DECIMAL,text:"%1.",alignment:AlignmentType.LEFT,style:{paragraph:{indent:{left:540,hanging:360}}}}]}]};
function cover(title,subtitle,rows,classif){
  const big=(t,s,c,b=true,a=120)=>new Paragraph({children:[new TextRun({text:t,font:FONT,size:s,bold:b,color:c})],spacing:{after:a}});
  return [
   new Paragraph({children:[],spacing:{before:900}}),
   big("N1 IT | Grupo Stefanini",30,BLUE,true,300),
   big("Grupo Stefanini · Documento corporativo",18,"666666",false,500),
   new Paragraph({children:[],border:{top:{style:BorderStyle.SINGLE,size:24,color:BLUE,space:1}},spacing:{after:300}}),
   big(title,56,NAVY,true,240), big(subtitle,28,"444444",false,900),
   tbl(null,rows,[2600,7038],{firstColBold:true,size:20}),
   gap(500), big(classif,18,"666666",false,0)];
}
module.exports={d,P,H1,H2,H3,B,N,brk,tbl,cell,callout,gap,png,caption,hdrftr,hdrftrLand,styles,numbering,cover,runs,NAVY,BLUE,LIGHT,GRAY,FONT,PORTRAIT_W,LAND_W,AlignmentType,Paragraph,TextRun};
