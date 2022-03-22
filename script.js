//Page Setup
//------------------------------------------------------------------------------//
//animate landing page loader
let landing = document.getElementById('landing-page')
//To set time interval for black background
//Could have done this with setTimeout()
setInterval(function(){
    landing.style.opacity= "0"}, 3000)
//To set time interval to remove landing page
setInterval(()=>
    landing.style.display = "none",3300)

//console.log(landing)
//console.log(document.getElementById('myImage').files)
//-------------------------------------------------------------------------//



//----------------------------------------------------------------------------//
//BEGINNING OF SCRIPT//
//----------------------------------------------------------------------------//
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.126.0/build/three.module.js'
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.126.0/examples/jsm/controls/OrbitControls.js'
import { Rhino3dmLoader } from 'https://cdn.jsdelivr.net/npm/three@0.126.0/examples/jsm/loaders/3DMLoader.js'
import { RhinoCompute } from 'https://cdn.jsdelivr.net/npm/compute-rhino3d@0.13.0-beta/compute.rhino3d.module.js'
import rhino3dm from 'https://cdn.jsdelivr.net/npm/rhino3dm@0.15.0-beta/rhino3dm.module.js'//Set up Slider Events
//Declare sliders//
//Set up Image Selection and Preview--------------------------------------//
let image, image2, reader, send, imageAddress, filepath;
//let width, height, scale, resolution, colormode, invert, abstraction, dots, boxes, plines, displacement, distortion;

image = document.getElementById("myImage")
const imagePreview = document.getElementsByClassName("image_preview")[0];
image.addEventListener('change', imageChange);


let width = document.getElementById("width")
width.addEventListener('click',  onSliderChange,false)
width.addEventListener('touchend',  onSliderChange,false)

let height = document.getElementById("height")
height.addEventListener('click', onSliderChange,false)
height.addEventListener('touchend', onSliderChange,false)

const scale = document.getElementById("scale")
scale.addEventListener('click', onSliderChange,false)
scale.addEventListener('touchend', onSliderChange,false)

const resolution = document.getElementById("resolution")
resolution.addEventListener('click', onSliderChange,false)
resolution.addEventListener('touchend', onSliderChange,false)

const colormode = document.getElementById("colormode")
colormode.addEventListener('click', onCheck, false)
let colorvalue=0;

const invert = document.getElementById("invert")
invert.addEventListener('click', onCheck, false)
let invertvalue=0;
//console.log(invert)

const dots = document.getElementById("dots")
dots.addEventListener("click", onClick)
const boxes = document.getElementById("boxes")
boxes.addEventListener("click", onClick)
const plines = document.getElementById("plines")
plines.addEventListener("click", onClick)
let pixels = 0
//console.log(pixels)

const abstraction = document.getElementById("abstraction")
abstraction.addEventListener('click', onSliderChange,false)
abstraction.addEventListener('touchend', onSliderChange,false)

const displacement = document.getElementById("displacement")
displacement.addEventListener('click', onSliderChange,false)
displacement.addEventListener('touchend', onSliderChange,false)

const distortion = document.getElementById("distortion")
distortion.addEventListener('click', onSliderChange,false)
distortion.addEventListener('touchend', onSliderChange,false)



// set up loader for converting the results to threejs
const definitionName = 'Portraits 3.gh';
const loader = new Rhino3dmLoader()
loader.setLibraryPath( 'https://cdn.jsdelivr.net/npm/rhino3dm@0.15.0-beta/' )

// globals
let rhino, definition, doc;

rhino3dm().then(async m => {
  console.log("Loaded rhino3dm.");
  rhino = m//global
    
    //RhinoCompute.url = getAuth( 'RHINO_COMPUTE_URL' ) // RhinoCompute server url. Use http://localhost:8081 if debugging locally.
    //RhinoCompute.apiKey = getAuth( 'RHINO_COMPUTE_KEY' )  // RhinoCompute server api key. Leave blank if debugging locally.
    
    RhinoCompute.url = 'http://localhost:8081/' //if debugging locally.        // load a grasshopper file!
    
    const url = definitionName
    const res = await fetch(url)
    const buffer = await res.arrayBuffer()
    const arr = new Uint8Array(buffer)
    definition = arr

    init()
    compute()
})

async function compute() {

  // clear objects from scene
   scene.traverse(child => {
      if (child.type === "Object3D") {
          scene.remove(child)
      }
  })


  const param1 = new RhinoCompute.Grasshopper.DataTree('Width')
  param1.append([0], [width.valueAsNumber])
 console.log(param1)

  const param2 = new RhinoCompute.Grasshopper.DataTree('Height')
  param2.append([0], [height.valueAsNumber])
  console.log(param2)

  const param3 = new RhinoCompute.Grasshopper.DataTree('Resolution')
  param3.append([0], [resolution.valueAsNumber])
  console.log(param3)

  const param4 = new RhinoCompute.Grasshopper.DataTree('Abstraction')
  param4.append([0], [abstraction.valueAsNumber])
  console.log(param4)

  const param5 = new RhinoCompute.Grasshopper.DataTree('Negative')
  param5.append([0],[invertvalue])
  console.log(param5)

  const param6 = new RhinoCompute.Grasshopper.DataTree('Pixels')
  param6.append([0],[pixels])
  console.log(param6)

  const param7 = new RhinoCompute.Grasshopper.DataTree('Monochrome')
  param7.append([0],[colorvalue])
  console.log(param7)

  const param8 = new RhinoCompute.Grasshopper.DataTree('Displacement')
  param8.append([0],[displacement.valueAsNumber])
  console.log(param8)

  const param9 = new RhinoCompute.Grasshopper.DataTree('Distortion')
  param9.append([0],[distortion.valueAsNumber])
  console.log(param9)

  const param10 = new RhinoCompute.Grasshopper.DataTree('ImageFile')
  param10.append([0],[filepath])
  console.log(param10)

  const param11 = new RhinoCompute.Grasshopper.DataTree('Scale')
  param11.append([0],[scale.valueAsNumber])
  console.log(param11)


  // clear values
  const trees = []
  trees.push(param1)
  trees.push(param2)
  trees.push(param3)
  trees.push(param4)
  trees.push(param5)
  trees.push(param6)
  trees.push(param7)
  trees.push(param8)
  trees.push(param9)
  trees.push(param10)
  trees.push(param11)



  const res = await RhinoCompute.Grasshopper.evaluateDefinition(definition, trees)
  console.log(res)
  //console.log(res.values[0])
  doc = new rhino.File3dm()

  // hide spinner
  document.getElementById('container').style.display = 'none'

  for (let i = 0; i < res.values.length; i++) {
 
    

      for (const [key, value] of Object.entries(res.values[i].InnerTree)) {
          for (const d of value) {
            //console.log(d)
              
                const data = JSON.parse(d.data)
                //console.log(data)
                const rhinoObject = rhino.CommonObject.decode(data)
                doc.objects().add(rhinoObject, null)

          }
      }
  }
// go through the objects in the Rhino document

let objects = doc.objects();
//console.log(objects)
for ( let i = 0; i < objects.count; i++ ) {

  const rhinoObject = objects.get( i );
  //console.log(rhinoObject)


   // asign geometry userstrings to object attributes
  if ( rhinoObject.geometry().userStringCount > 0 ) {
    const g_userStrings = rhinoObject.geometry().getUserStrings()
    rhinoObject.attributes().setUserString(g_userStrings[0][0], g_userStrings[0][1])
    
  }
}







  const buffer = new Uint8Array(doc.toByteArray()).buffer
  loader.parse(buffer, function (object) {
      //object.rotation.z = Math.PI (Work on image rotation to keep portrait or landscape)

      object.traverse((child) => {
          if (child.isLine) {
    
            if (child.userData.attributes.geometry.userStringCount > 0) {
              
              //get color from userStrings
              const colorData = child.userData.attributes.userStrings[0]
              const col = colorData[1];
    
              //convert color from userstring to THREE color and assign it
              const threeColor = new THREE.Color("rgb(" + col + ")");
              const mat = new THREE.LineBasicMaterial({ color: threeColor });
              child.material = mat;
            }
          }
        });

      scene.add(object)
      //console.log(scene)
      // hide spinner
      document.getElementById('container').style.display = 'none'
      })
    
    }
  send = document.getElementById('submit');
  send.addEventListener("click", onSend);

 

const downloadButton = document.getElementById("downloadButton")
downloadButton.disabled = false
downloadButton.onclick = download

  /////////////////////////////////////////////////////////////////////////////
 //                            HELPER  FUNCTIONS                            //
/////////////////////////////////////////////////////////////////////////////
// more globals
let scene, camera, renderer, controls

/**
 * Sets up the scene, camera, renderer, lights and controls and starts the animation
 */

function init() {

    // Rhino models are z-up, so set this as the default
    THREE.Object3D.DefaultUp = new THREE.Vector3( 0, 0, 1 );
    
    // create a scene and a camera
    scene = new THREE.Scene()
    scene.background = new THREE.Color(1, 1, 1)
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z=60

    // very light grey for background, like rhino
    scene.background = new THREE.Color('whitesmoke')

    // create the renderer and add it to the html
    renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio( window.devicePixelRatio )
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(renderer.domElement)

    // add some controls to orbit the camera
    controls = new OrbitControls(camera, renderer.domElement)

    // add a directional light
    const directionalLight = new THREE.DirectionalLight( 0xffffff )
    directionalLight.intensity = 2
    scene.add( directionalLight )

    const ambientLight = new THREE.AmbientLight()
    scene.add( ambientLight )

    // handle changes in the window size
    window.addEventListener( 'resize', onWindowResize, false )

    animate()
}

/**
 * Call appserver
 */
/*async function compute() {
  showSpinner(true);
    // initialise 'data' object that will be used by compute()
  const data = {
    definition: definition,
    inputs: {
      'ImageFile':filepath,
      'Width':width.valueAsNumber,
      'Height':height.valueAsNumber,
      'Scale':scale.valueAsNumber,
      'Resolution':resolution.valueAsNumber,
      'Negative':invert.checked,
      'Monochrome': colormode.checked,
      'Pixels': pixels,
      'Displacement': displacement.valueAsNumber,
      'Abstraction': abstraction.valueAsNumber, 
      'Distortion': distortion.valueAsNumber,
    }
  }

  console.log(data.inputs);
  // construct url for GET /solve/definition.gh?name=value(&...)
     
    const request = {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    };
  
    try {
      const response = await fetch("/solve", request);
  
      if (!response.ok) throw new Error(response.statusText);
  
      const responseJson = await response.json();
      collectResults(responseJson);
    } catch (error) {
      console.error(error);
    }

}

/**
 * Parse response
 
function collectResults(responseJson) {

    const values = responseJson.values

    // clear doc
    if( doc !== undefined)
        doc.delete()

    //console.log(values)
    doc = new rhino.File3dm()

    // for each output (RH_OUT:*)...
    for ( let i = 0; i < values.length; i ++ ) {
      // ...iterate through data tree structure...
      for (const path in values[i].InnerTree) {
        const branch = values[i].InnerTree[path]
        // ...and for each branch...
        for( let j = 0; j < branch.length; j ++) {
          // ...load rhino geometry into doc
          const rhinoObject = decodeItem(branch[j])
          if (rhinoObject !== null) {
            doc.objects().add(rhinoObject, null)
          }
        }
      }
    }

    if (doc.objects().count < 1) {
      console.error('No rhino objects to load!')
      showSpinner(false)
      return
    }

  // load rhino doc into three.js scene
  const buffer = new Uint8Array(doc.toByteArray()).buffer;
  loader.parse(buffer, function (object) {
    // clear objects from scene
    scene.traverse((child) => {
      if (
        child.userData.hasOwnProperty("objectType") &&
        child.userData.objectType === "File3dm"
      ) {
        scene.remove(child);
      }
    });

    ///////////////////////////////////////////////////////////////////////

    // color crvs
    object.traverse((child) => {
      if (child.isLine) {
        if (child.userData.attributes.geometry.userStringCount > 0) {
          //console.log(child.userData.attributes.geometry.userStrings[0][1])
          const col = child.userData.attributes.geometry.userStrings[0][1];
          const threeColor = new THREE.Color("rgb(" + col + ")");
          const mat = new THREE.LineBasicMaterial({ color: threeColor });
          child.material = mat;
        }
      }
    });

    ///////////////////////////////////////////////////////////////////////
    // add object graph from rhino model to three.js scene
    scene.add(object);

    // hide spinner and enable download button
    showSpinner(false);
    //downloadButton.disabled = false

        // hide spinner and enable download button
        showSpinner(false)
        downloadButton.disabled = false

        // zoom to extents
        zoomCameraToSelection(camera, controls, scene.children)
    })
}

/**
 * Attempt to decode data tree item to rhino geometry
 
function decodeItem(item) {
  const data = JSON.parse(item.data)
  if (item.type === 'System.String') {
    // hack for draco meshes
    try {
        return rhino.DracoCompression.decompressBase64String(data)
    } catch {} // ignore errors (maybe the string was just a string...)
  } else if (typeof data === 'object') {
    return rhino.CommonObject.decode(data)
  }
  return null
}*/



//* change functions//
function onSliderChange () {
  showSpinner(true)
  compute()
}

function onClick(e){
    //show spinner
    showSpinner(true);
    pixels = e.target.getAttribute('alt');   
    compute()
}

function onCheck(e){
  showSpinner(true);
  let b;
  let x = e.target.checked;
  console.log(e.target.id)
  console.log(x)
  if (x){
    b=1;
  }
  else{
    b=0
  }

  console.log(b)
  /* e.target.setAttribute('alt',"1");
    e.target.setAttribute('value', '1');
    console.log(e.target.alt)
 }
  else if (x===1){
    e.target.setAttribute('alt',"0")
    e.target.setAttribute('value', '0')

  }*/
  if(e.target.id == "colormode"){
    colorvalue = b;
  }
  else if(e.target.id =="invert"){
    invertvalue = b;
  }
  
  compute()
}

//Start ImageChange and Image Preview//

function imageChange(){
  console.log(image.files)
  console.log(image.files[0])
  console.log(imagePreview)
  while(imagePreview.firstChild){
      console.log(imagePreview.firstChild)
      console.log(imagePreview.innerHTML)
      imagePreview.removeChild(imagePreview.firstChild)
  }
  if (image.files.length === 0){
      alert('No Image Selected')
      imagePreview.innerHTML="No Image Selected"
      return      
  }else{
      alert('you have changed the image')
      updateImageDisplay()
  }  
  send.disabled = false
}

function updateImageDisplay(){
  
  image2 = document.createElement('img');
  imagePreview.appendChild(image2);
  if(validFileType(image.files[0])){
      imageAddress = URL.createObjectURL(image.files[0])}
      image2.src= imageAddress
      console.log(image2.width)
      //let cleanerpath = imageAddress.substring(10)/*replace('-','+')*/
      //cleanerpath = cleanerpath.replace('_', ('/'))
      console.log(image.files[0])
      image2.alt= image.files[0].name
      console.log(image2)
      //filepath = cleanerpath
}

function validFileType(file) {
  const fileTypes = ["image/png", "image/jpeg"];
  return fileTypes.includes(file.type);
}

function onSend(){
  //show spinner
  showSpinner(true);

  if (image.files && image.files[0]) {
      var fileSize;
      reader = new FileReader();
      reader.readAsDataURL(image.files[0]);
      
      //console.log(reader.result))
      reader.onload = function (event) {
          //var dataUrl = event.target.result; 
          //let imgs = document.createElement("img")
          //imgs.src = dataUrl
          fileSize = image.files[0].size
          console.log(fileSize)
          let fpath = reader.result;
          console.log(fpath)
          //filepath=fpath.substring(23);
          console.log(filepath)
          filepath = fpath.replace("data:", "").replace(/^.+,/, "");
          //let y = document.getElementById("filepath")

          compute()
                
      }
     reader.onerror = function(event) {
         console.error("File could not be read! Code " + event.target.error.code);
     };
                   
     reader.onloadend = function() {
         alert('Image uploaded')
         //filepath=reader.result.replace("data:", "").replace(/^.+,/, "");
         //compute()
     }
           
  }
  //console.log(dataUrl)
  //console.log(reader)
  //console.log(reader.result)
  
  send.disabled = true
  
  //return filepath

}


/**
 * The animation loop!
 */
function animate() {
  requestAnimationFrame( animate )
  controls.update()
  renderer.render(scene, camera)
}

/**
 * Helper function for window resizes (resets the camera pov and renderer size)
  */
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize( window.innerWidth, window.innerHeight )
  animate()
}

/**
 * Helper function that behaves like rhino's "zoom to selection", but for three.js!
 */
function zoomCameraToSelection( camera, controls, selection, fitOffset = 1.2 ) {
  
  const box = new THREE.Box3();
  
  for( const object of selection ) {
    if (object.isLight) continue
    box.expandByObject( object );
  }
  
  const size = box.getSize( new THREE.Vector3() );
  const center = box.getCenter( new THREE.Vector3() );
  
  const maxSize = Math.max( size.x, size.y, size.z );
  const fitHeightDistance = maxSize / ( 2 * Math.atan( Math.PI * camera.fov / 360 ) );
  const fitWidthDistance = fitHeightDistance / camera.aspect;
  const distance = fitOffset * Math.max( fitHeightDistance, fitWidthDistance );
  
  const direction = controls.target.clone()
    .sub( camera.position )
    .normalize()
    .multiplyScalar( distance );
  controls.maxDistance = distance * 10;
  controls.target.copy( center );
  
  camera.near = distance / 100;
  camera.far = distance * 100;
  camera.updateProjectionMatrix();
  camera.position.copy( controls.target ).sub(direction);
  
  controls.update();
  
}

document.getElementById("Reset View").addEventListener("click", () => {
  //using tween function to smoothly move from one position to another one
  const coords = { x: camera.position.x, y: camera.position.y, z:camera.position.z };
  /*var tween = new TWEEN.Tween(coords)
    .to({ x: 0 , y: 0, z: 70 }, 5000)
    .easing(TWEEN.Easing.Quadratic.Out)
    .onUpdate(() =>*/
      camera.position.set(0,0,70)//(coords.x, coords.y, coords.z)
    //)
    //.start();
});
/**
 * This function is called when the download button is clicked
 */
 function download () {
  let buffer = doc.toByteArray()
  let blob = new Blob([ buffer ], { type: "application/octect-stream" })
  let link = document.createElement('a')
  link.href = window.URL.createObjectURL(blob)
  link.download = 'Portraits.3dm'
  link.click()
}

/**
 * Shows or hides the loading spinner
 */
function showSpinner(enable) {
  if (enable)
  document.getElementById('container').style.display = 'flex';
  else
  document.getElementById('container').style.display = 'none';
}
