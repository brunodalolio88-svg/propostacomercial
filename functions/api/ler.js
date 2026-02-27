export async function onRequestGet(context) {
  try {
    const url = new URL(context.request.url);
    const id = url.searchParams.get('id');
    
    if (!id) return new Response("ID não fornecido", { status: 400 });

    const db = context.env.DB;
    // Busca a proposta no banco
    const proposta = await db.prepare("SELECT * FROM propostas WHERE id = ?").bind(id).first();

    if (!proposta) return new Response(JSON.stringify({ error: "Proposta não encontrada" }), { status: 404 });

    return new Response(JSON.stringify(proposta), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (erro) {
    return new Response(JSON.stringify({ error: erro.message }), { status: 500 });
  }
}
