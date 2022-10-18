const CONSTANTEDELGAS = 25078;
//Las temperaturas de los punto de ebullicion estan basadas en grados centigrados
const PUNTOEBULLICIONAGUA = 100;
const PUNTOEBULLICIONACEITE = 180;
const CAUDALDELGAS = 2.35;
const DENSIDADDELGAS = 1.16;
const temperaturaInicialDelMaterial = 20;
let presionDelTanque = 0;
let puntoEbullicion = 0;
let longitudTuberiaGas = 0;
let diametroTuberiaGas = 0;
let tipoMaterial = "";
let volumenDelMaterial = 0;
let temperaturaDelMaterial = 0;
let temperaturaDelaEstufa = [];
let baseDeLaOlla = 0;
let areaDeaLaOlla = 0;
let tiempoTransferenciaCalor = 0;
let tiempoEbullicion = 0;




//Funcion que se encarga de calcular la presion relativa de la tuberia
//Basandose en la primera de Renoaurd lineal
function CalculoDePresionRelativa(longitudTuberiaGas, diametroTuberiaGas){

    let DiametroCalculado = Math.pow(diametroTuberiaGas, 4.82);
    let CaudalCalculado = Math.pow(CAUDALDELGAS, 1.82);

    presionDelTanque = CONSTANTEDELGAS * DENSIDADDELGAS * longitudTuberiaGas * CaudalCalculado / DiametroCalculado;

    presionDelTanque = presionDelTanque.toFixed(2) * 10;

    return presionDelTanque;
}



//Funcion que se encarga de asignar los valores de la temperatura que puede tener la estufa
//Basandose en los rangos de temperatura que dependen de la presion del gas en la tuberia
function AsignarTemperaturaEstufaPorPresion(presionDelTanque){

    if (presionDelTanque <= 50 && presionDelTanque > 40) {
        temperaturaDelaEstufa.push(0, 90.5, 119.65, 148.8);
        return temperaturaDelaEstufa;
    }else if(presionDelTanque <= 40 && presionDelTanque > 30){
        temperaturaDelaEstufa.push(0 ,80, 100, 120);
        return temperaturaDelaEstufa;
    }else if(presionDelTanque <= 30 && presionDelTanque > 20){
        temperaturaDelaEstufa.push(0, 60, 75, 90);
        return temperaturaDelaEstufa;
    }else if(presionDelTanque <= 20 && presionDelTanque > 10){
        temperaturaDelaEstufa.push(0, 40, 50, 60);
        return temperaturaDelaEstufa;
    }else if(presionDelTanque <= 10 && presionDelTanque > 0){
        temperaturaDelaEstufa.push(0, 20, 30, 40);
        return temperaturaDelaEstufa;
    }else if(presionDelTanque <= 0){
        temperaturaDelaEstufa.push(0, 0, 0, 0);
        return temperaturaDelaEstufa;
    }

}


//Esta funcion se encarga de calcular el tiempo que se toma realizar la transeferencia de calor
//Entre la llama de la estufa y la olla en la que se esta realizando la simulacions
function calcularTiempoTranseferenciaCalor(baseDeLaOlla, areaDeaLaOlla, temperaturaDelaEstufa){

    tiempoTransferenciaCalor = baseDeLaOlla * temperaturaDelaEstufa / areaDeaLaOlla;

    return tiempoTransferenciaCalor;
}


//Esta funcion se encarga de calcular el tiempo de ebullicion que posee el material con el que estamos trabajando en primera instancia
function calculatTiempoEbullicionInicial(puntoEbullicion, volumenDelMaterial, temperaturaInicialDelMaterial){
    
    tiempoEbullicion = (puntoEbullicion / volumenDelMaterial) * temperaturaInicialDelMaterial;
    
    return tiempoEbullicion;

}

//Esta funcion se encarga de calcular el tiempo de ebullicion que puede tomar el material con el que estamos trabajando
//Basandonos en la temperatura actual de la estufa que puede variar con los controles en tiempo real
function calculatTiempoEbullicionConstante(puntoEbullicion, volumenDelMaterial, temperaturaDelMaterial){
    
    tiempoEbullicion = puntoEbullicion / volumenDelMaterial * temperaturaDelMaterial;
    
    return tiempoEbullicion;

}

function obtenerInformacion(){
    diametroTuberiaGas = document.getElementById("diametroTuberiaGas").value;
    longitudTuberiaGas = document.getElementById("longitudTuberiaGas").value;
    let select = document.getElementById("comboMateriales")
    tipoMaterial = select.options[document.getElementById("comboMateriales").selectedIndex].value;
    if(tipoMaterial == "Agua"){
        puntoEbullicion = PUNTOEBULLICIONAGUA;
    }
    else if(tipoMaterial == "Aceite"){
        puntoEbullicion = PUNTOEBULLICIONACEITE;
    }	
    volumenDelMaterial = document.getElementById("volumenDelMaterial").value;
    baseDeLaOlla = document.getElementById("baseDeLaOlla").value;
    areaDeaLaOlla = document.getElementById("areaDeaLaOlla").value;
    
    return diametroTuberiaGas, longitudTuberiaGas, tipoMaterial, volumenDelMaterial, baseDeLaOlla, areaDeaLaOlla;
}

function calcularTiempos(){

    // clearTimeout(timeoutIncial);

    // clearTimeout(timeoutActual);

    let timeoutActual = setInterval(() => {
        calcularTiempoTranseferenciaCalor(baseDeLaOlla, areaDeaLaOlla, temperaturaDelaEstufa);
        calculatTiempoEbullicionConstante(puntoEbullicion, volumenDelMaterial, temperaturaDelMaterial);
        let tiempoTotal = tiempoTransferenciaCalor + tiempoEbullicion;
        return tiempoTotal;
    }, tiempoTotal);

}

function actualizarTiempos(tiempo){
    document.getElementById("TiempoActual").innerHTML = "Tiempo restante: " + tiempo.toFixed(0) + " segundos";
    let valorSlider = document.getElementById("manubrio-estufa-range").value;
    document.getElementById("TemperaturaActual").innerHTML = "Temperatura Actual: " +  temperaturaDelaEstufa[valorSlider].toFixed(2) + " °C";
}


function asignarTemperaturaEstufaSlide(){
    let valorSlider = document.getElementById("manubrio-estufa-range").value;
    return temperaturaDelaEstufa[valorSlider];
}

function comenzarSimulacion(){
    
    obtenerInformacion();
    CalculoDePresionRelativa(longitudTuberiaGas, diametroTuberiaGas);
    AsignarTemperaturaEstufaPorPresion(presionDelTanque);
    
    calculatTiempoEbullicionInicial(puntoEbullicion, volumenDelMaterial, temperaturaInicialDelMaterial);
    calcularTiempoTranseferenciaCalor(baseDeLaOlla, areaDeaLaOlla, asignarTemperaturaEstufaSlide());

    let tiempoInicial =  tiempoTransferenciaCalor <= 0 ? tiempoTransferenciaCalor : tiempoEbullicion + tiempoTransferenciaCalor; 

    actualizarTiempos(tiempoInicial);
    
    let timeoutIncial = setInterval(() => {
        // actualizarTiempos(tiempoInicial);
    }, tiempoInicial);

    return timeoutIncial;
}