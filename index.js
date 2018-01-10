d3.xml("main_anim.svg").mimeType("image/svg+xml").get(function(error, xml) {
  if (error) throw error;
  document.body.appendChild(xml.documentElement)
  callback( d3.select('svg') );
});

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}
document.body.addEventListener("keypress", function(){
  window.location.href = "http://localhost:3000?q=" + (parseInt(getParameterByName("q"))+1);
  //window.location.reload()
} , false)

function callback(svg){

  /*
        давайте тогда сначала с мелочами закончим, из всех сейчас остались пункты:
      1. анимация зданий
      3. форма света у вертолета слева не такая, как исходная. и такое впечатление, что прозрачность чуть меньше, может из за неверной конечной прозрачности при анимации
      6. в тз еще была анимация «Динозавр двигается хостом, пастью (+ возможно лапами, надо посмотреть)»
      7. интерфейс на часах из 1 в 2 пояляется со scale, а из 2 в 3 с fade. мне кажется также через scale было бы лучше
      9. анимация огня машины
      10. фиолетовый индикатор слева сверху за зданием
      11. проектор чуть дергается при анимации
      12. свет от прожекторов не двигается вместе с вертолетами

      6 - я так понимаю сложно, давайте заменим на анимацию машин. чтобы они как вертолеты подъезжали (движение + fade)

      3, 7, 10, 11, 12 - я так понимаю мелочи
  */

//   svg.append("clipPath")       // define a clip path
//   .attr("id", "ellipse-clip") // give the clipPath an ID
// .append("ellipse")          // shape it as an ellipse
//   .attr("cx", 175)         // position the x-centre
//   .attr("cy", 100)         // position the y-centre
//   .attr("rx", 100)         // set the x radius
//   .attr("ry", 50);         // set the y radius
//
// // draw clipped path on the screen
// var cp = svg.append("rect");
//           cp// attach a rectangle
//   .attr("x", 125)        // position the left of the rectangle
//   .attr("y", 75)         // position the top of the rectangle
//   .attr("clip-path", "url(#ellipse-clip)") // clip the rectangle
//   .style("fill", "lightgrey")   // fill the clipped path with grey
//   .attr("height", 100)    // set the height
//   .attr("width", 0);    // set the width
//
//   cp
//   .transition()
//   .duration(1000)
//   .attr("width", 200);


    (function(){
      var t = 0;
      setInterval(function(){
        d3.select('#st2_2_').style('opacity', 1 - t)
        d3.select('#st4').style('opacity', t)
        t = 1 - t;
      }, 10);
    })();

    var stage1 = d3.select('#stage1'),
        stage2 = d3.select('#stage2'),
        stage3 = d3.select('#stage3');


    //stage1.style('opacity', 0);
    stage2.style('opacity', 0);
    stage3.style('opacity', 0);

    function stageFunc(){

      /*
      На экране загорается индикатор звонка (scale) и появляется текст слева направо (вероятно тоже scale)
      */

      var elems = [
        '#whitecircle','#watchcirlce','#watchoutcircle','#X'
      ]
      //d3.select('#callgroup').attr('transform', 'scale(0 0)' )

      for(var n in elems){
        d3.select(elems[n]).attr("transform-origin", "50% 50%" );
        d3.select(elems[n]).attr('transform', 'scale(0 0)' )
        d3.select(elems[n])
        .transition()
        .delay(delay)
        .duration(delay)
        .attr('transform', 'scale(1 1)' )

      }

      /*
      Круги на заднем фоне индикатора фиолетвые увеличиваются и исчезают
      */

      d3.select('.hiderel')
      .attr("transform-origin", "50% 50%" )

      // d3.selectAll('.hiderel').each(function(d,i){
      //   d3.select(this)
      //   .attr('transform', 'scale(0 0)' )
      //   .attr("transform-origin", "50% 50%" )
      //   d3.select(this)
      //   .transition()
      //   .duration(delay)
      //   .attr('transform', 'scale(1 1)' )
      //   .on("end", function(){ d3.select(this)
      //     .transition()
      //     .duration(delay*.4)
      //     .attr('transform', 'scale(0 0)' )
      //   })
      // })

      /*
      Белый круг индикатора пульсирующе увеличивается
      */
      pulse('#whitecircle')
      pulse('#call')
      pulse('#outCircle', {delay: 200})
      pulse('#middleCircle', {delay: 100})


      /*
      Появляются вертолеты (двигаются в направлении как нарисованы и у них меняется непрозрачность с 0 до 1
      */

      //d3.select('#stage3').remove()
      var heli = ['#helicopter3','#helicopter2','#helicopter1'];

      /*

      вертолеты должны вылетать (которые два сверху)

      */

      var helidelay = delay*1.9;

      (function repeat1(h,w, first){
        var hh = h || 5;// == -5?5:-5;
        var ww = w == -1?1:-1;
        if( first ){
          d3.select('#helicopter3')
          .attr('transform', `translate(60 -40)` )
          .attr('opacity',0)
          d3.select('#helicopter3')
          .transition()
          .duration(delay)
          .delay(helidelay)
          .ease( d3.easeSinInOut )
          .attr('opacity',1)
          .attr('transform', `translate(${Math.cos(w)*h} ${Math.sin(w)*h})` )
          .on("end", function(){ repeat1(hh,ww) })
        }else{
          d3.select('#helicopter3')
          .transition()
          .duration(delay*.4)
          //.delay(delay*.6)
          .ease( d3.easeSinInOut )
          .attr('transform', `translate(${Math.cos(w)*h} ${Math.sin(w)*h})` )
          .on("end", function(){ repeat1(hh,ww) })
        }
      })(2,1,true);

      (function repeat2(h,w, first){
        var hh = h||5;// == -5?5:-5;
        var ww = w == -1?1:-1;
        if( first ){
          d3.select('#helicopter2')
          .attr('transform', `translate(-60 -40)` )
          .attr('opacity',0)
          d3.select('#helicopter2')
          .transition()
          .duration(delay)
          .delay(helidelay)
          .ease( d3.easeSinInOut )
          .attr('opacity',1)
          .attr('transform', `translate(${Math.cos(w)*h} ${Math.sin(w)*h})` )
          .on("end", function(){ repeat2(hh,ww) })
        }else{
          d3.select('#helicopter2')
          .transition()
          .duration(delay*.4)
          //.delay(delay*.6)
          .ease( d3.easeSinInOut )
          .attr('transform', `translate(${Math.cos(w)*h} ${Math.sin(w)*h})` )
          .on("end", function(){ repeat2(hh,ww) })
        }
      })(1,1,true);


      d3.select('#helicopter1').attr('opacity',0)

      // (function repeat3(h,w, first){
      //   var hh = h||5;//== -5?5:-5;
      //   var ww = w == -1?1:-1;
      //   d3.select('#helicopter1')
      //   .transition()
      //   .duration(delay*.4)
      //   //.delay(delay*.6)
      //   .ease( d3.easeSinInOut )
      //   .attr('transform', `translate(${Math.cos(w)*h} ${Math.sin(w)*h})` )
      //   .on("end", function(){ repeat3(hh,ww) })
      // })(Math.floor(Math.random()*5)+1,1,true);

      /*
        кнопки появляются слева направо
      */

      var cpPath = d3.select('#inputCenter').node().getBBox();

      var clip = svg.append("clipPath");

      var rect = clip
      .attr("id", "cp-clip")
      .append('rect')

      /*
        Замена на анимацию машин
      */
      d3.select('#car1')
      .attr('transform', 'translate(5 -10)')
      .style('opacity',0)

      d3.select('#car2')
      .style('opacity',0)
      .attr('transform', 'translate(-10 -10)')

      d3.select('#car1')
      .transition()
      .delay(delay)
      .style('opacity',1)
      .attr('transform', 'translate(0 0)')

      d3.select('#car2')
      .transition()
      .delay(delay)
      .style('opacity',1)
      .attr('transform', 'translate(0 0)')

      /*
        убрать моргание
      */
      //d3.select('#cube').style('opacity',0)

      // .append("rect")
      // .attr('x', cpPath.x )
      // .attr('y', cpPath.y )
      // .attr('width', cpPath.width )
      // .attr('height', cpPath.height )
      // .attr('transform', `translate(-${ Math.floor(cpPath.width) } 0)` );

      // clip
      // .transition()
      // .duration(delay)
      // .attr('transform', `translate(${ Math.floor(cpPath.width) } 0)` );


      d3.select('#inputCenter')
      .attr("clip-path", "url(#cp-clip)")



      rect.attr('width', 0)
      rect.attr('height', cpPath.height*2)
      rect.attr('x', cpPath.x)
      rect.attr('y', cpPath.y)
      rect.attr('fill', 'rgba(255,0,0,.4)')
      rect.attr("transform-origin", "0% 50%")
      rect.attr('transform', `rotate(45) translate(-${cpPath.width/4} -${cpPath.height + 20})`)

      rect
      .transition()
      .duration(delay)
      .attr('width',cpPath.width)



      // d3.select('#inputCenter')
      // .transition()
      // .duration(delay)
      // .attr('transform','scale(1 1)')

      d3.select('#buttonLeft')
      .attr('opacity',0)
      d3.select('#buttonLeft')
      .transition()
      .duration(delay)
      .attr('opacity',1)

      d3.select('#buttonRight')
      .attr('opacity',0)
      d3.select('#buttonRight')
      .transition()
      .duration(delay)
      .delay(delay*.5)
      .attr('opacity',1)



      /*
        активируем второй слой
      */
      stage2
      .transition()
      .style('opacity', 1)
      .on('end', stageFunc2 )
    }

    function stageFunc2(){

      // Ожидание третьей анимации..

      var DelaySecondStage = 2000;



      var elDL = [
        '#callgroup','#inputCenter','#buttonLeft','#buttonRight','#screen_1_'
      ]
      var elems = [
        '#watchcirlce','#watchoutcircle','#X'
      ]
      for(var n in elems){
        d3.select(elems[n])
        .transition()
        .delay(DelaySecondStage)
        .duration(delay*.4)
        .attr('transform','scale(0 0)')
      }
      for(var i=0;i<elDL.length;i++){
        d3.select(elDL[i])
        .transition()
        .delay(DelaySecondStage)
        .duration(delay*.4)
        .style('opacity',0);
      }


      d3.select('#watchscreen')
      .attr('transform','scale(0 0)')
      .attr("transform-origin", "50% 50%")


      stage3
      .transition()
      .delay(DelaySecondStage)
      .duration(delay)
      .style('opacity', 1)
      .on('end', stageFunc3 )
    }

    //d3.select('#whitescreen3Fake').style('opacity',1)

    function stageFunc3(){



      d3.select('#watchscreen')
      .transition()
      .duration(delay)
      .attr('transform','scale(1 1)')


      d3.select('roads').attr('opacity',0);

      d3.select('roads')
      .transition()
      .duration(delay)
      .attr('opacity',1)


      // d3.select('bMask1')
      // .transition()
      // .duration(delay)
      // .attr('transform', 'translate(0 -400)')

    for(var i=0;i < buildingMask.length;i++){
        var b = buildingMask;


        b[i]
        .transition()
        .duration(delay)
        .attr('transform', 'translate(0 0)')
        //.on('end', bubleShow )
      }

      //console.log(buildingMask[i]);


      buildingMask[0]
      .transition()
      .duration(delay)
      .attr('transform', 'translate(0 0)')
      .on('end', bubleShow )


    }

    /*
      раздел с огнем
    */

    //d3.select('#fire-1').style('opacity',0)
    d3.select('#fire-2').style('opacity',0)


    var pathFire1  =  d3.select('#fire-1').attr('d'),
        pathFire2  =  d3.select('#fire-2').attr('d');


    function lightMyFire(p){
      d3.select('#fire-1')
      .transition()
      .duration(137)
      .attr('d' , p )
      .on('end' , function(){ lightMyFire( p == pathFire1 ? pathFire2 : pathFire1 ) })
    }

    lightMyFire(pathFire1)
    // function lightMyFire(arg){
    //   d3.select('#fire-2')
    //   .transition()
    //   .duration(140)
    //   .style('opacity', arg);
    //   d3.select('#fire-1')
    //   .transition()
    //   .duration(140)
    //   .style('opacity', 1 - arg)
    //   .on('end', function(){ lightMyFire(1- arg) })
    // }
    // lightMyFire(1)



    d3.select('#shadow1').attr('opacity',0)
    d3.select('#shadow2').attr('opacity',0)
    d3.select('#shadow3').attr('opacity',0)

    /*
    раздел с дино
    */
    d3.select("#dino").attr('opacity',0)

    function rec(t, op){
      d3.select("#dino").attr('opacity', op?1:0 );
      console.log(op);
      t<40?
      setTimeout(_=> rec(t+Math.floor(Math.random()*7), !op) , t)
      :d3.select("#dino").attr('opacity', 1);
    }

    var called;

    function dino(){

      if(called){

      }else{
        called = true;
        var op = 0, PWM;
        rec(10)
      }
    }


    /*
    раздел с фонариками
    */
    d3.select('#light3').attr('opacity',0)
    d3.select('#light4').attr('opacity',0)

    function heliOn(){
      d3.select('#light3')
      .transition()
      .duration(delay)
      .attr('opacity',.5)
      d3.select('#light4')
      .transition()
      .duration(delay)
      .attr('opacity',.5)
      .on("end", dino)
    }





    /*
    раздел с экранами
    */
    var SRC = ['#screens', '#menu1', '#apptext', '#buttonpurple'];
    for(var i in SRC){
      d3.select(SRC[i])
      .attr('opacity',0)
      .attr('transform',`translate(${20 * (i==1?1:-1)},-20)`)
    }

    // (function r(d){
    //   // for(var i=1;i<SRC.length;i++){
    //   //   d3.select(SRC[i])
    //   //   .transition()
    //   //   .duration(delay)
    //   //   .attr('transform', `translate(0 ${(d?1:-1)*10})`)
    //   //   //.on("end", i==0?r(!d):function(){})
    //   // }
    //   d3.select(SRC[0])
    //   .transition()
    //   .duration(delay)
    //   .attr('transform', `translate(0 ${(d?1:-1)*10})`)
    //   .on("end", r(!d))
    // })(true)

    function screenShow(){
      for(var i=0;i<SRC.length;i++){
        d3.select(SRC[i])
        .transition()
        .duration(delay)
        .attr('opacity',1)
        .attr('transform','translate(0,0)')
        .on("end", heliOn )
      }
      var d, t = 0;
      setInterval(function(){
        d ?
        t < 10 ? t+=.05 : d=!d :
        t > -10 ? t-=.05 : d=!d ;
        for(var i=0;i<SRC.length;i++){
            d3.select(SRC[i])
            .attr('transform', `translate(0 ${t})`)
            //.on("end", i==0?r(!d):function(){})
          }
      }, 20)
    }

    /*
    раздел с баблами
    */
    var bubles = ['#buble','#buble2','#buble3','#buble4','#text'];

    function bubleShow(){
      for(var i in bubles){
        d3.select(bubles[i])
        .attr('opacity',1)
      }

      for(var i=0;i< bubles.length;i++){
        var group = stage3.append('g');

        //console.log(d3.select(bubles[i]).node());

        if(d3.select(bubles[i]).node() != null){
          group.node().appendChild( d3.select(bubles[i]).node() )

          group
          .attr('opacity',0)
          .attr('transform', 'translate(0 20)')

          group
          .transition()
          .duration(delay)
          .attr('opacity',1)
          .attr('transform', 'translate(0 0)')
          .on("end", i == 0 ? screenShow : function(){} )
        }
      }
    }

    for(var i in bubles){
      d3.select(bubles[i])
      .attr('opacity',0)
    }

    var buildingMask = []


    d3.selectAll('.building').each(function(d,i){
      //buildingMask.push(d3.select(this).node().getBBox());
      var b = d3.select(this).node().getBBox();

      var g = stage3.append('g');

      g.node().appendChild(d3.select(this).node())

      //svg.append()
      //console.log(d3.select(this).node());
      //var clip = svg.append("defs").append('mask');
      //clip.attr('id', 'bMask'+i);
      //var cp = clip
      //.append("path")//.append('rect')

      buildingMask.push( d3.select(this) );


      // if(i==18){
      //   var TEST = d3.select(this).append('path')
      //   TEST.attr('fill','red')
      //   .attr('id', 'ID')
      //   //.attr('transform','translate(303 282)')
      //   .attr('d', 'M11.4485938,15.2495709 L0.8,12 L16.1,0.9 L37,7.474 L37,105.4 L22.1,115.6 L0.8,109.1 L0.8,12 L11.4485938,15.2495709 Z')
      // }

      function d(x,y,w,h,p, hl){
        return `M ${x} ${y} L ${x+w} ${y} L ${x+w} ${y+h*(hl||.9)} L ${x+w*(p||.5)} ${y+h} L ${x} ${y+h*(hl||.9)} z`
      }

      //var test = svg.append("path")
      //.attr('d', d(b.x,b.y,b.width,b.height, .7))
      // .attr('y',b.y )
      // .attr('width', b.width )
      // .attr('height', b.height - (i==18?b.height:0) )
      //.attr('fill','white')

      //cp
      //.attr('id', 'bMask'+i)
      //.attr("clip-path", `url(#${'bMask'+i})`)
      // .attr('x', b.x)
      // .attr('y',b.y )
      // .attr('width', b.width )
      // .attr('height', b.height - (i==18?b.height:0) )
      //.attr('d', d(b.x,b.y,b.width,b.height, .7, .95 ))
      //.attr('fill','white')
      //.attr('transform', 'translate(0 400)')


      /*
        Тестируем нормальную маску
      */

      //.attr("mask", `url(#${'bMask'+i})`)

      var bmasks = [23,40,11,1,24,5,2,12,13,25,26,6,26]

      bmasks[8] = 13;
      bmasks[20] = 15;
      bmasks[36] = 22;
      bmasks[40] = 21;

      if(i==18){
        g.attr('mask','url(#testMask)')

      }else{
        g
        //d3.select(this)
        .attr('mask', `url(#mainMask${bmasks[i]?bmasks[i]:''})`)
        // dev test
        // g.append('text')
        // .text(i)
        // .attr("font-family", "sans-serif")
        // .attr("font-size", "20px")
        // .attr("fill", "red")
        // .attr('x', b.x+10)
        // .attr('y', b.y+20)
        // .attr("mask", `url(#${'bMask'+i})`)

      }


      d3.select(this)
      .attr('transform', 'translate(0 400)')
      // d3.select(this)
      // .transition()
      // .duration(delay)
      // .attr('transform', 'translate(0 0)')
    });

    //console.log(buildingMask);

    // d3.selectAll('.building') //.attr('transform',function(d,i){ return 'translate(0 400)'})
    // .each(function(d,i){
    //   d3.select(this).attr('transform', 'translate(0 400)')
    // })

    /*
    Лопасти вертолетов крутятся, они слегка двигаются по вертикале
    */

    var v1 = d3.select('#vane1center').node().getBBox(),
        v2 = d3.select('#vane2center').node().getBBox(),
        v3 = d3.select('#vane3center').node().getBBox();

    /*
    Динозавр двигается хостов, пастью (+ возможно лапами, надо посмотреть)
    Индикаторы слегка двигаются по вертикале

    */

    // stage1
    // .transition()
    // .duration(delay)
    // .style('opacity', 1)
    //.on("end" ,
    stageFunc();


    var svgDefs = svg.append('defs');

    var mainGradient = svgDefs.append('linearGradient')
        .attr('id', 'mainGradient');

    mainGradient.append('stop')
        .attr('class', 'stop-left')
        .attr('offset', '0');

    mainGradient.append('stop')
        .attr('class', 'stop-right')
        .attr('offset', '1');

    var filter = svg.append("defs")
      .append("filter")
        .attr("id", "blur")
      .append("feGaussianBlur")
        .attr("stdDeviation", 5);


        var vane = function(x,y,add){
          this.x = x;
          this.y = y;
          this.selectAdd = add;
        };
        vane.prototype.draw = function(){
          this.g = d3.select(this.selectAdd).append('g');
          this.g.attr('transform', `scale(1 .5)`);
          var heli = this.g.append('g');

          var path1 = heli.append('line'),
              path2 = heli.append('line');

              heli.attr("filter", "url(#blur)")

          var start = [ this.x,this.y ], w = 100;

          var at = {
            'stroke-linecap':"round",
            x1:[start[0], start[0] - .5*w],
            y1:[start[1], start[1] + .5*w ],
            x2:[start[0], start[0] + .5*w],
            y2:[start[1] + w, start[1] + .5*w ],
            stroke:"white",
            'stroke-width':"4",
            transform: "rotate(45)",
            "transform-origin": "50% 50%"
          }
          for(var n in at){
            if(typeof at[n] == typeof '' ){
              path1.attr( n , at[n] )
              path2.attr( n , at[n] )
            }else{
              path1.attr( n , at[n][0] )
              path2.attr( n , at[n][1] )
            }
          }

          var rot = 0;
          setInterval(function(){
            rot+=20;
            path1.attr( 'transform' , `rotate(${rot})` );
            path2.attr( 'transform' , `rotate(${rot})` );
          }, 10)
          return this.g;
        }
        vane.prototype.redraw = function(x,y){
          this.g.remove()
          this.x = x, this.y = y;
          this.draw()
        }

        var v = new vane(v1.x , v1.y + v1.height + 800 , '#vane1')
        v.draw()

        var vv = new vane(v2.x , v2.y + v2.height + 1090 , '#vane2')
        vv.draw()

        var vvv = new vane(v3.x , v3.y + v3.height + 690 , '#vane3')
        vvv.draw()

}
