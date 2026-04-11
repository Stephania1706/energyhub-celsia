    "use client";

    import { useState } from "react";

    export default function LoginPage() {

    const [nombre, setNombre] = useState("");
    const [contrato, setContrato] = useState("");

    const handleLogin = () => {
        console.log("Login demo funcionando");

        const user = {
        nombre,
        contractId: contrato,
        ubicacion: {
            address: "No definida",
            lat: 0,
            lng: 0,
        },
        };

        // Guardar en el navegador
        localStorage.setItem("user", JSON.stringify(user));

        // 🔥 IMPORTANTE: ruta relativa
        window.location.href = "/energyhub-celsia/dashboard";
    };

    return (
        <div className="h-screen flex items-center justify-center bg-slate-100 overflow-hidden">

        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm">
            
            <h1 className="text-2xl font-bold mb-6 text-center">
            Iniciar Sesión
            </h1>

            <input
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e)=>setNombre(e.target.value)}
            className="w-full mb-4 p-3 border rounded-lg"
            />

            <input
            type="text"
            placeholder="Número de contrato"
            value={contrato}
            onChange={(e)=>setContrato(e.target.value)}
            className="w-full mb-6 p-3 border rounded-lg"
            />

            <button
            type="button"
            onClick={handleLogin}
            className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition"
            >
            Entrar
            </button>

        </div>
        </div>
    );
    }