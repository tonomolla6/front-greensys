import React from 'react';
import { ArrowRight, Building2, CreditCard, LayoutDashboard, LogIn, TicketCheck, Users } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navegación */}
      <nav className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-emerald-500" />
              <span className="ml-2 text-xl font-bold text-gray-900">GreenSys</span>
            </div>
            <div className="flex items-center space-x-4">
              <a href="#login" className="btn-secondary">Iniciar Sesión</a>
              <a href="#register" className="btn-primary">Comenzar</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Sección de Inicio de Sesión */}
      <section id="login" className="py-12">
        <div className="max-w-md mx-auto px-4">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Inicia Sesión en GreenSys</h1>
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Bienvenido de nuevo</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                <input type="email" className="input-field" placeholder="tu@empresa.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                <input type="password" className="input-field" placeholder="••••••••" />
              </div>
              <button type="submit" className="btn-primary w-full">
                Iniciar sesión en tu cuenta
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Sección de Registro */}
      <section id="register" className="py-12 bg-white">
        <div className="max-w-md mx-auto px-4">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Crea tu Cuenta GreenSys</h1>
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Información del Negocio</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Negocio</label>
                <input type="text" className="input-field" placeholder="Nombre de tu empresa" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Legal del Negocio</label>
                <input type="text" className="input-field" placeholder="Nombre registrado del negocio" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Negocio</label>
                  <input type="text" className="input-field" placeholder="ej., SRL" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sitio Web (Opcional)</label>
                  <input type="url" className="input-field" placeholder="https://" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">País</label>
                <select className="input-field">
                  <option value="US">Estados Unidos</option>
                  <option value="ES">España</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ID Fiscal (CIF/NIF/NIE)</label>
                  <input type="text" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono de Contacto</label>
                  <input type="tel" className="input-field" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                <input type="email" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                <input type="password" className="input-field" />
              </div>

              <div className="border-t pt-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Bancaria</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Banco</label>
                    <input type="text" className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">IBAN</label>
                    <input type="text" className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Código SWIFT</label>
                    <input type="text" className="input-field" />
                  </div>
                </div>
              </div>

              <button type="submit" className="btn-primary w-full">Crear cuenta</button>
              <p className="text-center text-sm text-gray-600">
                ¿Ya estás registrado? <a href="#login" className="text-emerald-600 hover:text-emerald-500">Iniciar sesión</a>
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* Sección de Pago */}
      <section id="payment" className="py-12">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Pago Seguro</h1>
          <div className="card">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Completa tu compra</h2>
              <div className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5 text-emerald-500" />
                <span className="text-sm text-gray-600">Pago seguro</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Número de Tarjeta</label>
                  <input type="text" className="input-field" placeholder="4242 4242 4242 4242" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Vencimiento</label>
                    <input type="text" className="input-field" placeholder="MM/AA" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                    <input type="text" className="input-field" placeholder="123" />
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Resumen del Pedido</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">$99.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Impuestos</span>
                    <span className="font-medium">$9.90</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between">
                      <span className="font-medium">Total</span>
                      <span className="font-medium">$108.90</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <button className="btn-primary w-full mt-8">Pagar ahora</button>
          </div>
        </div>
      </section>

      {/* Panel de Administración */}
      <section id="admin" className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Panel de Administración</h1>
          <div className="flex">
            {/* Barra Lateral */}
            <div className="w-64 pr-8">
              <nav className="space-y-1">
                <a href="#" className="flex items-center px-4 py-2 text-sm font-medium text-emerald-500 bg-emerald-50 rounded-lg">
                  <LayoutDashboard className="h-5 w-5 mr-3" />
                  Panel
                </a>
                <a href="#" className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg">
                  <Users className="h-5 w-5 mr-3" />
                  Clientes
                </a>
                <a href="#" className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg">
                  <TicketCheck className="h-5 w-5 mr-3" />
                  Tickets
                </a>
              </nav>
            </div>

            {/* Contenido Principal */}
            <div className="flex-1">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Resumen</h2>
              </div>

              {/* Estadísticas */}
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="card">
                  <div className="text-sm font-medium text-gray-600">Clientes Totales</div>
                  <div className="mt-2 text-3xl font-bold text-gray-900">2,543</div>
                  <div className="mt-1 text-sm text-emerald-500">↑ 12% desde el mes pasado</div>
                </div>
                <div className="card">
                  <div className="text-sm font-medium text-gray-600">Tickets Activos</div>
                  <div className="mt-2 text-3xl font-bold text-gray-900">128</div>
                  <div className="mt-1 text-sm text-emerald-500">↓ 8% desde el mes pasado</div>
                </div>
                <div className="card">
                  <div className="text-sm font-medium text-gray-600">Ingresos</div>
                  <div className="mt-2 text-3xl font-bold text-gray-900">$45,231</div>
                  <div className="mt-1 text-sm text-emerald-500">↑ 23% desde el mes pasado</div>
                </div>
              </div>

              {/* Lista de Clientes */}
              <div className="card">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-medium text-gray-900">Clientes Recientes</h2>
                  <button className="btn-secondary">Ver todos</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-sm font-medium text-gray-500">
                        <th className="pb-4">Nombre</th>
                        <th className="pb-4">Correo Electrónico</th>
                        <th className="pb-4">Estado</th>
                        <th className="pb-4">Fecha de Registro</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm text-gray-600">
                      <tr className="border-t">
                        <td className="py-4">John Doe</td>
                        <td>john@example.com</td>
                        <td><span className="px-2 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 rounded-full">Activo</span></td>
                        <td>14 Mar, 2024</td>
                      </tr>
                      <tr className="border-t">
                        <td className="py-4">Jane Smith</td>
                        <td>jane@example.com</td>
                        <td><span className="px-2 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 rounded-full">Activo</span></td>
                        <td>13 Mar, 2024</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Panel de Cliente */}
      <section id="client" className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Panel de Cliente</h1>
          <div className="flex">
            {/* Barra Lateral */}
            <div className="w-64 pr-8">
              <nav className="space-y-1">
                <a href="#" className="flex items-center px-4 py-2 text-sm font-medium text-emerald-500 bg-emerald-50 rounded-lg">
                  <LayoutDashboard className="h-5 w-5 mr-3" />
                  Resumen
                </a>
                <a href="#" className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg">
                  <CreditCard className="h-5 w-5 mr-3" />
                  Compras
                </a>
                <a href="#" className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg">
                  <TicketCheck className="h-5 w-5 mr-3" />
                  Soporte
                </a>
              </nav>
            </div>

            {/* Contenido Principal */}
            <div className="flex-1">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Bienvenido de nuevo, John</h2>
              </div>

              {/* Compras Recientes */}
              <div className="card mb-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-medium text-gray-900">Compras Recientes</h2>
                  <button className="btn-secondary">Ver todas</button>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">Plan Premium</div>
                      <div className="text-sm text-gray-600">14 Mar, 2024</div>
                    </div>
                    <div className="text-lg font-medium text-gray-900">$99.00</div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">Servicio Adicional</div>
                      <div className="text-sm text-gray-600">10 Mar, 2024</div>
                    </div>
                    <div className="text-lg font-medium text-gray-900">$29.00</div>
                  </div>
                </div>
              </div>

              {/* Tickets de Soporte */}
              <div className="card">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-medium text-gray-900">Tickets de Soporte</h2>
                  <button className="btn-primary">Nuevo Ticket</button>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">Problema Técnico</div>
                      <div className="text-sm text-gray-600">Ticket #1234 • Creado hace 2 días</div>
                    </div>
                    <span className="px-2 py-1 text-xs font-medium text-yellow-700 bg-yellow-50 rounded-full">En Progreso</span>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">Pregunta de Facturación</div>
                      <div className="text-sm text-gray-600">Ticket #1233 • Creado hace 5 días</div>
                    </div>
                    <span className="px-2 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 rounded-full">Resuelto</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
