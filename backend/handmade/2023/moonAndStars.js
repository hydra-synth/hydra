// Based off egg of the phoenix by www.alexandrerangel.art.br/hydra.html

speed=1.2
shape(99,.15,.5).color(0,1,2)

.modulate(osc(25,0.1,0.5)
              .scale(({time})=>Math.sin(time*1)*0.5+1)
              .modulate(noise(0.6,0.5)),
              0.5)
.diff( shape(240,.5,0).scrollX(.05).rotate( ()=>time/10 ).color(1,0,.75) )
.diff( shape(99,.4,.002).scrollX(.10).rotate( ()=>time/20 ).color(1,0,.75) )
.diff( shape(99,.3,.002).scrollX(.15).rotate( ()=>time/30 ).color(1,0,.75) )
.modulate(noise(0.6,0.5))
.diff( shape(99,.2,.002).scrollX(.20).rotate( ()=>time/40 ).color(1,0,.75) )
.kaleid(50)
.diff( shape(99,.1,.002).scrollX(.25).rotate( ()=>time/50 ).color(1,0,.75) )

.modulateScale(
  shape(240,.5,0).scrollX(.05).rotate( ()=>time/10 )
  , ()=>(Math.sin(time/3)*.2)+.2 )
.modulate(noise(0.1,0.05))
.scale(1.6,.6,1)
.out()