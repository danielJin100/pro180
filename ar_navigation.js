let coordinates = {}

$(document).ready(function () {
    get_coordinates();
    render_elements();
})

function get_coordinates() {
    let searchParams = new URLSearchParams(window.location.search)
    if (searchParams.has('source') && searchParams.has('destination')) {
        let source = searchParams.get('source')
        let destination = searchParams.get('destination')
        coordinates.source_lat = source.split(";")[0]
        coordinates.source_lon = source.split(";")[1]
        coordinates.destination_lat = destination.split(";")[0]
        coordinates.destination_lon = destination.split(";")[1]
    } else {
        alert("Coordinates not selected!")
        window.history.back();
    }
}

function render_elements() {
   $.ajax({
        url: `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates.source_lon}%2C${coordinates.source_lat}%3B${coordinates.destination_lon}%2C${coordinates.destination_lat}?alternatives=true&geometries=polyline&steps=true&access_token=pk.eyJ1IjoiYXBvb3J2ZWxvdXMiLCJhIjoiY2ttZnlyMDgzMzlwNTJ4a240cmEzcG0xNyJ9.-nSyL0Gy2nifDibXJg4fTA`,
        type: "get",

        success: function(response){
            let images = {
                "left": "ar_left.png",
                "right": "ar_right.png",
                "slight_left": "ar_slight_left.png",
                "slight_right": "ar_slight_right.png",
                "straight": "ar_straight.png"
            }
            response.routes[0].legs[0].steps
            for(let i=0; i<steps.length; i++){
                let image;
                let distance = steps[i].distance
                let instruction = steps[i].maneuver.instruction
                if(instruction.includes("Turn Right")){
                    image="right"
                }
                else if(instruction.includes("Turn Left")){
                    image="left"
                }
                $("#scene-container").append(
                `
                    <a-entity gps-entity-place="latitude: ${steps[i].maneuver.location[1]}; longitude: ${steps[i].manuever.location[0]};">
                        <a-image
                            name="${instruction}"
                            src="./assets/${images[image]}"
                            look_at="#step_${(i>0? i-1:i+1)}"
                            scale="5 5 5"
                            id="step_${i>0? i-1:i}"
                            position="0 0 0"
                        >
                        </a-images>
                        <a-entity>
                            <a-text height="50" value="${instruction} (${distance}m)"></a-text>
                        </a-entity>
                    </a-entity>
                `)
            }
        }
   })
}
