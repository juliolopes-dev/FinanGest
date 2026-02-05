## TABELAS  QUE JA EXISTE NO BANCO DE DADOS 

"auditoria_vendas"
tabela de vendas onde contem as colunas

id = id do protudo
cod_filial = codigo da filial
tipo_pedido = tipo de pedido "55" pedidos faturados
cod_pedido = codigo do pedido
cod_cliente = codigo do cliente
cod_produto = codigo do produto
preco_unitario = preco unitario do produto
data_pedido = data do pedido
quantidade = quantidade do produto
faturado = se foi faturado ou não ("S" faturado,) ("N" não faturado) ("X" cancelado)
cod_vendedor = codigo do vendedor

toda linha representa a um item vendendi, então pode ter varias linhas com o mesmo cod_pedido.
