const margin = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50
};

const width = 1800 - margin.left - margin.right;
const height = 1200 - margin.top - margin.bottom;

const svg = d3.select('body').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

const data = [
    { id: 1, x:0,y:0, orient: 'horisontal',status:true },
    { id: 2, x:105,y:0, orient: 'horisontal',status:false },
    { id: 3, x:0,y:55, orient: 'horisontal',status:true },
    { id: 4, x:105,y:55, orient: 'horisontal',status:true },
    { id: 5, x:300,y:20, orient: '45',status:true },
    { id: 6, x:300,y:100, orient: '45',status:true },
    { id: 7, x:300,y:180, orient: '45',status:true },
    { id: 8, x:300,y:260, orient: '45',status:true },
    { id: 9, x:500,y:500, orient: 'horisontal',status:true },
    { id: 10, x:605,y:500, orient: 'horisontal',status:true },
    { id: 11, x:710,y:500, orient: 'horisontal',status:false },
    { id: 12, x:0,y:300, orient: 'vertical',status:false },
];

    function  draw(){
        const parkings = svg.selectAll('.parking').data(data);
        const parkingHeight = 50;
        const parkingWidth = 100;


        const parkingsAdd = parkings
            .enter()
            .append('rect')


        parkingsAdd.merge(parkings)
            .attr('class', 'parking')
            .attr('height', parkingHeight)
            .attr('width', parkingWidth)
            .attr('x', d => d.x)
            .attr('y', d => d.y)
            .attr('rx', 15)
            .attr('id', d=>d.id)
            .attr('fill', d => d.status? "palevioletred":"darkseagreen")
            .attr('transform', d=>{
                switch (d.orient){
                    case "horisontal":
                        return "rotate(0, 0, 0)"
                    case "vertical":
                        return `rotate(90, ${d.x}, ${d.y})`
                    case "45":
                        return `rotate(45, ${d.x}, ${d.y})`

                    default:
                        return "rotate(0, 0, 0)"
                }
            })
            .on('click', function (){

                var Color = ["palevioletred","darkseagreen"];
                //switch ===> 0 or 1
                this.switch = this.switch ^ 1;
                //color ===> "white" or "red"
                var nextColor = Color[this.switch];
                d3.select(this).style("fill", nextColor);
                console.log(this.id);
                $('#myModal').modal({backdrop: true})
            })
    }
draw();