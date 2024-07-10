import "./App.css";
import React from "react";
import {Canvas, useFrame} from '@react-three/fiber';
import {OrbitControls} from "@react-three/drei";
import {BufferGeometry, Vector3} from "three";

export default function App(): JSX.Element {
    return (
        <Canvas style={{width: "100%", height: "100%"}} camera={{position: [0, 20, 25], fov: 45}}>
            <Sun/>
            {planetData.map((planet) => <Planet key={planet.id} planet={planet}/>)}
            <Lights/>
            <OrbitControls/>
        </Canvas>
    );
}

function Sun(): JSX.Element {
    return (
        <mesh>
            <sphereGeometry args={[2.5, 32, 32]}/>
            <meshStandardMaterial color="#E1DC59"/>
        </mesh>
    );
}

function Planet({ planet: {color, xRadius, zRadius, size, speed, offset} }): JSX.Element {
    const planetRef = React.useRef();

    useFrame(({ clock }) => {
        const time = clock.getElapsedTime() * speed + offset;
        const x = xRadius * Math.sin(time);
        const z = zRadius * Math.cos(time);
        planetRef.current.position.x = x;
        planetRef.current.position.z = z;
    });

    return (
        <>
            <mesh ref={planetRef}>
                <sphereGeometry args={[size, 32, 32]}/>
                <meshStandardMaterial color={color}/>
            </mesh>
            <Ecliptic xRadius={xRadius} zRadius={zRadius}/>
        </>
    );
}

function Lights(): JSX.Element {
    return (
        <>
            <ambientLight/>
            <pointLight position={[0, 0, 0]}/>
        </>
    );
}

function Ecliptic({xRadius = 1, zRadius = 1}) {
    const points = [];
    for (let index: number = 0; index < 64; index++) {
        const angle = (index / 64) * Math.PI * 2;
        const x = xRadius * Math.cos(angle);
        const z = zRadius * Math.sin(angle);
        points.push(new Vector3(x, 0, z));
    }

    points.push(points[0]);

    const lineGeometry = new BufferGeometry().setFromPoints(points);

    return (
        <line geometry={lineGeometry}>
            <lineBasicMaterial attach="material" color="#BFBBDA" linewidth={10}/>
        </line>
    );
}

const random = (a: number , b: number) => a + Math.random() * b;
const randomInt = (a: number, b: number) => Math.floor(random(a, b));

const randomColor = (): string =>
    `rgb(${randomInt(80, 50)}, ${randomInt(80, 50)}, ${randomInt(80, 50)})`;

const planetData: { id: number; color: string; xRadius: number; zRadius: number; size: number; }[] = [];
const totalPlanets: number = 6;

for (let i = 0; i < totalPlanets; i++) {
    planetData.push({
        id: i,
        color: randomColor(),
        xRadius: (i + 1.5) * 4,
        zRadius: (i + 1.5) * 2,
        size: random(0.5, 1),
        speed: random(0.5, 0.2),
        offset: random(0, Math.PI * 2),
    });
}
