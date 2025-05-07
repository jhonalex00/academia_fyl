const crearAcademia = async (data) => {
const res = await fetch('http://localhost:3001/api/academias', {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
});

if (!res.ok) {
    throw new Error('Error al crear la academia');
}

return res.json();
};