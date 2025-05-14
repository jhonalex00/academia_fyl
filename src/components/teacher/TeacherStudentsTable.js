import React from 'react';

const TeacherStudentsTable = ({ students }) => {
  if (!students || students.length === 0) {
    return <div className="bg-white p-4 rounded shadow text-gray-500">No tienes alumnos asignados.</div>;
  }

  // Columnas básicas - puedes ajustarlas según los datos disponibles en 'students'
  const columns = [
    { header: 'Nombre', accessor: 'name' },
    { header: 'Apellidos', accessor: 'surname' },
    { header: 'Email', accessor: 'email' },
    { header: 'Teléfono', accessor: 'phone' },
    // Puedes añadir más columnas como DNI, Estado, etc. si es necesario
    // { header: 'DNI', accessor: 'dni' },
    // { header: 'Estado', accessor: 'status', cell: (row) => (
    //   <span className={`px-2 py-1 text-xs font-medium rounded-full ${row.status === 'Inactivo' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
    //     {row.status || 'Activo'}
    //   </span>
    // )},
  ];

  return (
    <div className="bg-white rounded shadow overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th 
                key={col.accessor} 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {students.map((student) => (
            <tr key={student.idstudent}>
              {columns.map((col) => (
                <td key={col.accessor} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {col.cell ? col.cell(student) : student[col.accessor] || '-'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TeacherStudentsTable; 