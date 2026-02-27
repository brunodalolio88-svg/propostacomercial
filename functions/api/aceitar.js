export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const { id, nome_cliente } = body;
    
    // A mágica da Cloudflare: Pega o IP real de onde o cliente acessou
    const ip_cliente = context.request.headers.get('cf-connecting-ip') || 'IP Desconhecido';
    
    // Pega a data e hora do aceite (Fuso horário do Brasil)
    const data_aceite = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
    
    // Gera um código verificador Hash único para essa assinatura
    const hash_validador = "KYN-SIG-" + crypto.randomUUID().split('-')[0].toUpperCase();

    const db = context.env.DB;

    // Atualiza o banco travando a proposta como "aceita"
    await db.prepare(
      "UPDATE propostas SET status = 'aceito', nome_cliente = ?, ip_cliente = ?, data_aceite = ?, hash_validador = ? WHERE id = ?"
    ).bind(nome_cliente, ip_cliente, data_aceite, hash_validador, id).run();

    return new Response(JSON.stringify({ 
      success: true, 
      hash: hash_validador, 
      ip: ip_cliente, 
      data: data_aceite 
    }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (erro) {
    return new Response(JSON.stringify({ error: erro.message }), { status: 500 });
  }
}
