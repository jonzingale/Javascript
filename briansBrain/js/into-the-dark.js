(function(){

var world_width = 400,
	world_height = 400,
	controlbox_width = 400,
	controlbox_height = 400,
	n_grid_x = 24,
	n_grid_y = 24;
	
var world = d3.selectAll("#into_the_dark_display").append("svg")
	.attr("width",world_width)
	.attr("height",world_height)
	.attr("class","explorable_display")
	
var controls = d3.selectAll("#into_the_dark_controls").append("svg")
	.attr("width",controlbox_width)
	.attr("height",controlbox_height)
	.attr("class","explorable_widgets")	
	
var g = widget.grid(controlbox_width,controlbox_height,n_grid_x,n_grid_y);



var anchors = g.lattice(); // g has a method that returns a lattice with x,y coordinates

/*controls.selectAll(".grid").data(anchors).enter().append("circle")
	.attr("class","grid")
	.attr("transform",function(d){return "translate("+d.x+","+d.y+")"})
	.attr("r",1)
	.style("fill","black")
	.style("stroke","none")

*/



// fixed parameters 
	
var N = 100, // # of agents
	L = 128, // world size
	agentsize = 6,
	dt = 1, 
	noise_speed = 0.5, //variation in individuals' speeds
	epsilon = 0.2, // angular increment
	
	R_coll = 1,
	blindspot = 100;
	
var Nhd = 3,
	vhd = 0.075,
	rhd = 30;	
		
// this are the default values for the slider variables

var def_speed_dark = 0.35,
	def_speed_light = 0.85, 
	def_R_align = 1,
	def_R_attract = 17,
	def_noise_heading = 15;

var def_contrast = 1.0;	


	
var playblock = g.block({x0:5,y0:19,width:0,height:0});
var buttonblock = g.block({x0:3,y0:12,width:4,height:0}).Nx(2);
var speedblock = g.block({x0:12,y0:18,width:10,height:3}).Ny(2);
var swarmblock = g.block({x0:12,y0:8,width:10,height:6}).Ny(3);
var darknessblock = g.block({x0:3,y0:2,width:6,height:3}).Ny(2);
var regionsblock = g.block({x0:14,y0:-1,width:0,height:9}).Ny(3);
	
// here are the buttons


var playpause = { id:"b1", name:"", actions: ["play","pause"], value: 0};
var back = { id:"b2", name:"", actions: ["back"], value: 0};
var reset = { id:"b3", name:"", actions: ["rewind"], value: 0};

var playbutton = [
	widget.button(playpause).size(g.x(7)).symbolSize(0.6*g.x(7)).update(runpause)
]

var buttons = [
	widget.button(back).update(resetpositions),
	widget.button(reset).update(resetparameters)
]

// now the sliders for the fish

var speed_dark = {id:"speed_dark", name: "Speed in the dark", range: [0.2,1], value: def_speed_dark};
var speed_light = {id:"speed_light", name: "Speed in the light", range: [0.2,1], value: def_speed_light};
var R_align = {id:"ralign", name: "Alignment", range: [0,10], value: def_R_align};
var R_attract = {id:"rattract", name: "Attraction", range: [0,25], value: def_R_attract};
var noise_heading = {id:"noise_heading", name: "Wiggle", range: [0,30], value: def_noise_heading};

var contrast = {id:"contrast", name: "Contrast", range: [0,1], value: def_contrast};


var sliderwidth = speedblock.w();
var handleSize = 12, trackSize = 8;

var speed = [
	widget.slider(speed_dark).width(sliderwidth).trackSize(trackSize).handleSize(handleSize),
	widget.slider(speed_light).width(sliderwidth).trackSize(trackSize).handleSize(handleSize)
]

var swarming = [
	widget.slider(R_align).width(sliderwidth).trackSize(trackSize).handleSize(handleSize),
	widget.slider(R_attract).width(sliderwidth).trackSize(trackSize).handleSize(handleSize),
	widget.slider(noise_heading).width(sliderwidth).trackSize(trackSize).handleSize(handleSize)
]

var contr = [
	widget.slider(contrast).width(darknessblock.w()).trackSize(trackSize).handleSize(handleSize)
]

// darkness parameters

var darkness = {id:"t1", name: "Dark Zones",  value: true};
var collective = {id:"t2", name: "Collective Behavior",  value: true};

var darknesslevel = {id:"darknesslevel", name: "Level of Darkness", range: [0,1], value: 1};

var toggles = [
	widget.toggle(darkness).label("right").size(14).update(toggledarkness),
	widget.toggle(collective).label("right").size(14).update(toggleinteractions)
]

// hideout choices

var regions = {id:"r1", name:"Hideouts", choices: ["Moving Disk","Corners","On the right"], value:0 };

var region = [
	widget.radio(regions).size(regionsblock.h()).label("right")
		.shape("circle").buttonSize(30)
		.buttonInnerSize(20).fontSize(14)
]


pb = controls.selectAll(".button .playbutton").data(playbutton).enter().append(widget.buttonElement)
	.attr("transform",function(d,i){return "translate("+playblock.x(0)+","+playblock.y(i)+")"});	

bu = controls.selectAll(".button .others").data(buttons).enter().append(widget.buttonElement)
	.attr("transform",function(d,i){return "translate("+buttonblock.x(i)+","+buttonblock.y(0)+")"});	


spsl = controls.selectAll(".slider .block1").data(speed).enter().append(widget.sliderElement)
	.attr("transform",function(d,i){return "translate("+speedblock.x(0)+","+speedblock.y(i)+")"});	

swsl = controls.selectAll(".slider .block2").data(swarming).enter().append(widget.sliderElement)
	.attr("transform",function(d,i){return "translate("+swarmblock.x(0)+","+swarmblock.y(i)+")"});	


/*rg = controls.selectAll(".radio").data(region).enter().append(widget.radioElement)
		.attr("transform","translate("+regionsblock.x(0)+","+ regionsblock.y(0) +")")

*/
tl = controls.selectAll(".toggle").data(toggles).enter().append(widget.toggleElement)
	.attr("transform",function(d,i){return "translate("+darknessblock.x(0)+","+darknessblock.y(i)+")"});	

/*ctsl = controls.selectAll(".slider .darkness").data(contr).enter().append(widget.sliderElement)
	.attr("transform",function(d,i){return "translate("+darknessblock.x(-1)+","+darknessblock.y(0)+")"});	
*/

// position scales
var X = d3.scaleLinear().domain([0,L]).range([0,world_width]);
var Y = d3.scaleLinear().domain([0,L]).range([world_height,0]);

// helps translate degrees and radian

var g2r = d3.scaleLinear().domain([0,360]).range([0,2*Math.PI]);
var r2g = d3.scaleLinear().range([0,360]).domain([0,2*Math.PI]);

/////////////////////////
// this is the agent data	
/////////////////////////
	
var agents = d3.range(N).map(function(d,i){
	return {id:i, 
			x: Math.random() * L, 
			y: Math.random() * L, 
			theta: Math.random() * 360,
			speed_var:(1+Math.random()*noise_speed),
			selected: false}
})



var hideouts = d3.range(Nhd).map(function(d,i){
	var theta = Math.random() * Math.PI * 2;
	return {id:i, 
			x: Math.random() * L, 
			y: Math.random() * L, 
			vx: vhd * Math.cos(theta),
			vy: vhd * Math.sin(theta),
			r : rhd
	}
})


						
/////////////////////////////////////////
		
// add agents to the scene

hideout = world.selectAll(".hole").data(hideouts).enter().append("circle")
	.attr("class",".hole")
	.attr("transform",function(d){
		return "translate("+X(d.x)+","+Y(d.y)+")"
	})
	.attr("r",function(d){return X(d.r)})
	.style("fill","rgb(50,50,50)")


agent = world.selectAll(".agent").data(agents).enter().append("g")
	.attr("class","agent")
	.attr("transform",function(d){
		return "translate("+X(d.x)+","+Y(d.y)+")rotate("+(-d.theta)+")"
	})
	
	
agent.append("path")
	.attr("class","drop")
	.attr("d",tadpole)
	.style("opacity",0)
	.transition().duration(1000).style("opacity",1)
	

// timer variable for the simulation

var t; 

// functions for the action buttons

function runpause(d){ d.value == 1 ? t = d3.timer(runsim,0) : t.stop(); }

function resetpositions(){
	
	if (typeof(t) === "object") {t.stop()};
	
	agents.forEach(function(d){
		d.x = Math.random() * L;
		d.y = Math.random() * L;
		d.theta = Math.random() * 360;
	})

	d3.selectAll(".agent").transition().duration(1000).attr("transform",function(d){
		return "translate("+X(d.x)+","+Y(d.y)+")rotate("+(-d.theta)+")"
	}).call(function(){
		if (typeof(t) === "object" && playpause.value == 1 ) {t = d3.timer(runsim,0)}
	})
	
}

function resetparameters(){
		speed[0].click(def_speed_dark);
		speed[1].click(def_speed_light);
		swarming[0].click(def_R_align);
		swarming[1].click(def_R_attract);
		swarming[2].click(def_noise_heading);
}

function toggledarkness(d){
	if(d.value){
		hideout.transition().duration(1000).style("opacity",1)		
	} else {
		hideout.transition().duration(1000).style("opacity",0)
	}
}

function toggleinteractions(d){
	if(d.value){
		d3.selectAll("#slider_ralign").transition().duration(1000).style("opacity",1)
		d3.selectAll("#slider_rattract").transition().duration(1000).style("opacity",1)
		d3.selectAll("#slider_ralign").selectAll(".track-overlay").style("pointer-events","all");
		d3.selectAll("#slider_rattract").selectAll(".track-overlay").style("pointer-events","all");		

	} else {
		d3.selectAll("#slider_ralign").transition().duration(1000).style("opacity",0)	
		d3.selectAll("#slider_rattract").transition().duration(1000).style("opacity",0)	
		d3.selectAll("#slider_ralign").selectAll(".track-overlay").style("pointer-events","none");
		d3.selectAll("#slider_rattract").selectAll(".track-overlay").style("pointer-events","none");		

	}
}


function runsim(){

	var wanted_x, // this is the target direction 
		wanted_y; // an agent wants to move to		
	
	var blind = Math.cos(( 180 - blindspot / 2 )/180*Math.PI);
	
	hideouts.forEach(function(d){
		var dx =  dt * d.vx;
		var dy =  dt * d.vy;
		var x_new= (d.x + dx);
		var y_new= (d.y + dy);
		
		if (x_new < 0 || x_new > L) {dx *= -1; d.vx*=-1};
		if (y_new < 0 || y_new > L) {dy *= -1 ; d.vy*=-1};

		d.x= (d.x + dx)
		d.y= (d.y + dy)
	})
	
	agents.forEach(function(a){

		// these are the agents in the collision radius apart from the reference agent
		var colliders = [];
		colliders = agents.filter(function(d){
			dx = (a.x-d.x);
			dy = (a.y-d.y);
			return ( Math.sqrt(dx*dx + dy*dy)  < R_coll ) && ( d.id != a.id )
		})
		// either collisions occur or alignment and attraction occur
		
		if(colliders.length>0) {
			wanted_x = a.x - d3.mean(colliders,function(d){ return d.x});
			wanted_y = a.y - d3.mean(colliders,function(d){ return d.y});
		} 
		
		// if no collisions occur agents align with agents in their alignment radius
		// and are attracted to the the agents in the attraction radius
		
		else {
			vx = Math.cos(g2r(a.theta));
			vy = Math.sin(g2r(a.theta));
			vabs = Math.sqrt(vx*vx + vy*vy);

			// the interaction set are all agents within the larger attraction radius
			// and outside the blind spot
			
			interaction_set = agents.filter(function(d){
					dx = d.x-a.x;
					dy = d.y-a.y;
					d.r = Math.sqrt(dx*dx+dy*dy);
					sight = (dx*vx + dy*vy) / (vabs * d.r);
					return ( d.r < R_attract.value ) &&  (sight > blind) && d.id!=a.id
			})
			
			// now we separate them into the agents to align with and those to be attracted to
			
			var n_orient = interaction_set.filter(function(d){ return d.r < R_align.value })
			var n_attract = interaction_set.filter(function(d){ return d.r > R_align.value })
			
			var theta_orient = a.theta,
				theta_attract = a.theta;

			var L_orient = n_orient.length;
			var L_attract = n_attract.length;

			if (L_orient > 0 && collective.value){
					var mx = d3.mean(n_orient,function(x){ return Math.cos(g2r(x.theta))})
					var my = d3.mean(n_orient,function(x){ return Math.sin(g2r(x.theta))})
					theta_orient = r2g(Math.atan2(my,mx));
			}
			
			if (L_attract > 0 && collective.value){
					var mx = d3.mean(n_attract,function(d){ return d.x});
					var my = d3.mean(n_attract,function(d){ return d.y});
					theta_attract = r2g(Math.atan2(my-a.y,mx-a.x));
			} 
			
			// this is the anticipated direction
			
			wanted_x = 0.5*( Math.cos(g2r(theta_orient)) + Math.cos(g2r(theta_attract)))
			wanted_y = 0.5*( Math.sin(g2r(theta_orient)) + Math.sin(g2r(theta_attract)))
		}
		
		// this is the update rule, epsilon is the amount of change towards the target direction	
		
		var new_x = Math.cos(g2r(a.theta)) +  epsilon * wanted_x;
		var new_y = Math.sin(g2r(a.theta)) +  epsilon * wanted_y;
		a.theta=  r2g(Math.atan2(new_y,new_x));
	})
	
	// wiggle: add a little noise to the angle
	
	agents.forEach(function(d){
		d.theta = d.theta + (Math.random() -  0.5) * noise_heading.value;
	})
		
	// make a step
	
	agents.forEach(function(d){
		
		var hidden = hideouts.filter(function(a){
			var q = (a.x-d.x);
			var p = (a.y-d.y);
			return ( Math.sqrt(q*q + p*p)  < a.r );
		})
		
		var v = (hidden.length == 0 || darkness.value==false) ? speed_light.value : speed_dark.value;
		var phi = g2r(d.theta);
		var dx =  dt * v*d.speed_var * Math.cos(phi);
		var dy =  dt * v*d.speed_var * Math.sin(phi);
	
		var x_new= (d.x + dx);
		var y_new= (d.y + dy);
		
		// this takes care of the boundaries
		
		if (x_new < 0 || x_new > L) dx *= -1;
		if (y_new < 0 || y_new > L) dy *= -1;

		d.x= (d.x + dx)
		d.y= (d.y + dy)
		d.theta = r2g(Math.atan2(dy,dx))	
	})
	
	// update stuff on screen

	agent.data(agents)
		.attr("transform",function(d){
				return "translate("+X(d.x)+","+Y(d.y)+")rotate("+(-d.theta)+")"
		})
		
	hideout.data(hideouts)
		.attr("transform",function(d){
				return "translate("+X(d.x)+","+Y(d.y)+")"
		})				
}		

	
/////////////////////////////////////////	

// this is the shape of the agent as a path
	
function tadpole () {
	var M = 30;
	var line = d3.line().x(function(d) { return agentsize*d.x; }).y(function(d) { return agentsize*d.y; });	
	var drop = d3.range(M).map(function(d,i){
			return { 
				x: -2 * Math.cos(i/M*Math.PI*2), 
				y:      Math.sin(i/M*Math.PI*2) * Math.pow( Math.sin(i/M/2*Math.PI*2) , 6 )
			};
		})
	return line(drop);
}	


})()