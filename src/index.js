import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { Resend } from 'resend'

const app = new Hono()

app.use('/', cors({ origin: '*' }))

app.post('/', async (c) => {
  const resend = new Resend(c.env.RESEND_API_KEY)
  const { name, email, message } = await c.req.json()

  const { error } = await resend.emails.send({
    from: `${name} <contacto@fabianmorag.com>`,
    to: ['contacto@fabianmorag.com'],
    subject: 'Contacto desde fabianmorag.com',
    html:
      `
      <ul>
        <li>
          <strong>Nombre</strong>: ${name}
        </li>
        <li>
          <strong>Email</strong>: ${email}
        </li>
        <li>
          <strong>Mensaje</strong>: ${message}
        </li>
      </ul>
      `
  })

  if (error) {
    return c.error('Error sending email', { status: 500 })
  }

  return c.text('OK', { status: 200 })
})

export default app
