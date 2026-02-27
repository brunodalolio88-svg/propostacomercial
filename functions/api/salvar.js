export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const { conteudo_html } = body;
    
    // Gera um ID curto e único (Ex: 8f7a9b)
    const id = crypto.randomUUID().split('-')[0]; 
    const db = context.env.DB; // Conexão com o banco D1

    // Salva no banco de dados
    await db.prepare(
      "INSERT INTO propostas (id, conteudo_html, status) VALUES (?, ?, 'pendente')"
    ).bind(id, conteudo_html).run();

    return new Response(JSON.stringify({ success: true, id: id }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (erro) {
    return new Response(JSON.stringify({ error: erro.message }), { status: 500 });
  }
}
