module.exports = {
  apps : [{
   "name":"backend-election",
    script: 'index.js',
    instance_var:'INSTANCE_ID',
    watch:true,
    watch_delay:1000,	
    env:{
	"PORT": 3000,
	"NODE_ENV":"development"
     },
    env:{
	"PORT":3000,
	"NODE_ENV":'production'
    }
  }]
};
