-- Guarda a data real em que o boleto foi marcado como pago.
-- Boletos ja pagos antes desta migracao usam o vencimento como fallback historico.

alter table boletos
  add column if not exists data_pagamento date;

update boletos
set data_pagamento = vencimento
where status = 'pago'
  and data_pagamento is null;

create index if not exists idx_boletos_data_pagamento
  on boletos(restaurante_id, data_pagamento);
