<script lang="ts">
  import { goto } from "$app/navigation";
  import Button from "$lib/components/ui/Button.svelte";
  import Card from "$lib/components/ui/Card.svelte";
  import Badge from "$lib/components/ui/Badge.svelte";
  import Tabs from "$lib/components/ui/Tabs.svelte";
  import Table from "$lib/components/ui/Table.svelte";
  import EmptyState from "$lib/components/ui/EmptyState.svelte";
  import {
    ArrowLeft,
    Edit,
    Mail,
    Phone,
    MapPin,
    FileText,
    Plus,
    Calendar,
    MessageCircle,
  } from "lucide-svelte";
  import type { Client, Policy } from "$lib/types/database.types";
  import { isMobileNumber, getWhatsAppUrl } from "$lib/utils/phone";

  type PageData = {
    client: Client;
    policies: Policy[];
  };

  let { data } = $props<{ data: PageData }>();

  let activeTab = $state("info");
  let showInactivePolicies = $state(false);
  
  // Filtrar pólizas según el checkbox
  const filteredPolicies = $derived(
    showInactivePolicies
      ? data.policies
      : data.policies.filter((p: Policy) => p.active !== false)
  );

  const tabs = [
    { id: "info", label: "Información" },
    { id: "policies", label: `Pólizas (${data.policies.length})` },
  ];

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  }

  function getStatusBadge(status: string): { variant: 'error' | 'success' | 'info' | 'warning' | 'default'; label: string } {
    const variants: Record<string, 'error' | 'success' | 'info' | 'warning' | 'default'> = {
      active: "success",
      cancelled: "error",
      expired: "warning",
    };

    const labels: Record<string, string> = {
      active: "Activa",
      cancelled: "Cancelada",
      expired: "Vencida",
    };

    return {
      variant: variants[status] || "default",
      label: labels[status] || status,
    };
  }
</script>

<svelte:head>
  <title>{data.client.first_name} {data.client.last_name} - PAS Manager</title>
</svelte:head>

<div class="page">
  <div class="page-header">
    <div>
      <Button variant="ghost" size="sm" onclick={() => goto("/clientes")}>
        <ArrowLeft size={18} />
        Volver
      </Button>
      <h1>{data.client.first_name} {data.client.last_name}</h1>
      <p>Información detallada del cliente</p>
    </div>
    <Button
      variant="primary"
      onclick={() => goto(`/clientes/${data.client.id}/editar`)}
    >
      <Edit size={18} />
      Editar Cliente
    </Button>
  </div>

  <Tabs {tabs} bind:activeTab on:change={(e) => (activeTab = e.detail)}>
    {#if activeTab === "info"}
      <div class="info-grid">
        <Card>
          <div class="card-header">
            <h2>Datos Personales</h2>
          </div>

          <div class="info-list">
            {#if data.client.email_primary}
              <div class="info-item">
                <Mail size={18} />
                <div>
                  <div class="label">Email Principal</div>
                  <div class="value">{data.client.email_primary}</div>
                </div>
              </div>
            {/if}

            {#if data.client.email_secondary}
              <div class="info-item">
                <Mail size={18} />
                <div>
                  <div class="label">Email Secundario</div>
                  <div class="value">{data.client.email_secondary}</div>
                </div>
              </div>
            {/if}

            <div class="info-row">
              {#if data.client.phone}
                <div class="info-item">
                  <Phone size={18} />
                  <div class="phone-content">
                    <div class="label">Celular</div>
                    <div class="value phone-with-whatsapp">
                      <span>{data.client.phone}</span>
                      {#if isMobileNumber(data.client.phone)}
                        <a
                          href={getWhatsAppUrl(data.client.phone)}
                          target="_blank"
                          rel="noopener noreferrer"
                          class="whatsapp-btn"
                          title="Abrir en WhatsApp"
                        >
                          <MessageCircle size={16} />
                        </a>
                      {/if}
                    </div>
                  </div>
                </div>
              {/if}

              {#if data.client.phone_landline}
                <div class="info-item">
                  <Phone size={18} />
                  <div>
                    <div class="label">Teléfono</div>
                    <div class="value">{data.client.phone_landline}</div>
                  </div>
                </div>
              {/if}
            </div>

            {#if data.client.document_number}
              <div class="info-item">
                <FileText size={18} />
                <div>
                  <div class="label">DNI/CUIT</div>
                  <div class="value">{data.client.document_number}</div>
                </div>
              </div>
            {/if}

            {#if data.client.birth_date}
              <div class="info-item">
                <Calendar size={18} />
                <div>
                  <div class="label">Fecha de Nacimiento</div>
                  <div class="value">{formatDate(data.client.birth_date)}</div>
                </div>
              </div>
            {/if}
          </div>
        </Card>

        <Card>
          <div class="card-header">
            <h2>Dirección</h2>
          </div>

          <div class="info-list">
            {#if data.client.address || data.client.city || data.client.postal_code}
              <div class="info-item">
                <MapPin size={18} />
                <div>
                  <div class="label">Ubicación</div>
                  <div class="value">
                    {#if data.client.address}
                      <div>{data.client.address}</div>
                    {/if}
                    {#if data.client.city || data.client.postal_code}
                      <div>
                        {data.client.postal_code || ""}
                        {data.client.city || ""}
                      </div>
                    {/if}
                  </div>
                </div>
              </div>
            {:else}
              <div class="empty-info">No hay dirección registrada</div>
            {/if}
          </div>
        </Card>

        <Card class="full-width">
          <div class="card-header">
            <h2>Información Adicional</h2>
          </div>

          <div class="info-list">
            {#if data.client.alias_pas}
              <div class="info-item">
                <FileText size={18} />
                <div>
                  <div class="label">Alias PAS</div>
                  <div class="value">{data.client.alias_pas}</div>
                </div>
              </div>
            {/if}

            {#if data.client.referred_by}
              <div class="info-item">
                <FileText size={18} />
                <div>
                  <div class="label">Referido Por</div>
                  <div class="value">{data.client.referred_by}</div>
                </div>
              </div>
            {/if}
          </div>
        </Card>

        {#if data.client.observations}
          <Card class="full-width">
            <div class="card-header">
              <h2>Observaciones</h2>
            </div>
            <p class="notes">{data.client.observations}</p>
          </Card>
        {/if}
      </div>
    {:else if activeTab === "policies"}
      <div class="policies-section">
        <div class="policies-header">
          <div>
            <h2>Pólizas del Cliente</h2>
            <label class="checkbox-label">
              <input 
                type="checkbox" 
                bind:checked={showInactivePolicies}
              />
              <span>Mostrar inactivas</span>
            </label>
          </div>
          <Button
            variant="primary"
            size="sm"
            onclick={() => goto(`/polizas/nuevo?client_id=${data.client.id}`)}
          >
            <Plus size={16} />
            Nueva Póliza
          </Button>
        </div>

        {#if filteredPolicies.length === 0 && !showInactivePolicies}
          <EmptyState
            icon={FileText}
            title="Sin pólizas activas"
            description="Este cliente no tiene pólizas activas"
          />
        {:else if data.policies.length === 0}
          <EmptyState
            icon={FileText}
            title="Sin pólizas"
            description="Este cliente no tiene pólizas registradas"
            action={{
              label: "Crear Póliza",
              onclick: () => goto("/polizas/nuevo"),
            }}
          />
        {:else}
          <Table>
            <thead>
              <tr>
                <th>N° Póliza</th>
                <th>Tipo</th>
                <th>Aseguradora</th>
                <th>Estado</th>
                <th>Prima</th>
                <th>Vencimiento</th>
              </tr>
            </thead>
            <tbody>
              {#each filteredPolicies as policy}
                {@const statusBadge = getStatusBadge(policy.status)}
                <tr
                  onclick={() => goto(`/polizas/${policy.id}/editar`)}
                  class="clickable-row"
                >
                  <td>
                    <span class="policy-number">{policy.policy_number}</span>
                  </td>
                  <td>{policy.policy_type}</td>
                  <td>{policy.insurer}</td>
                  <td>
                    <Badge variant={statusBadge.variant}>
                      {statusBadge.label}
                    </Badge>
                  </td>
                  <td>{formatCurrency(policy.premium)}</td>
                  <td>
                    <div class="date-cell">
                      <Calendar size={14} />
                      {formatDate(policy.end_date)}
                    </div>
                  </td>
                </tr>
              {/each}
            </tbody>
          </Table>
        {/if}
      </div>
    {/if}
  </Tabs>
</div>

<style lang="scss">
  @use "$lib/styles/mixins" as *;

  .page {
    margin: 0 auto;
  }

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: var(--space-6);
    flex-wrap: wrap;
    gap: var(--space-4);

    h1 {
      font-size: var(--text-3xl);
      font-weight: var(--font-bold);
      color: var(--text-primary);
      margin: var(--space-4) 0 var(--space-2);
    }

    p {
      color: var(--text-secondary);
      margin: 0;
    }
  }

  .info-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-6);

    :global(.full-width) {
      grid-column: 1 / -1;
    }
  }

  .card-header {
    margin-bottom: var(--space-4);
    padding-bottom: var(--space-3);
    border-bottom: 1px solid var(--border-primary);

    h2 {
      font-size: var(--text-lg);
      font-weight: var(--font-semibold);
      color: var(--text-primary);
      margin: 0;
    }
  }

  .info-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .info-row {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-4);

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }

  .info-item {
    display: flex;
    gap: var(--space-3);

    :global(svg) {
      color: var(--primary-600);
      flex-shrink: 0;
      margin-top: 2px;
    }

    .phone-content {
      flex: 1;
    }

    .label {
      font-size: var(--text-xs);
      font-weight: var(--font-medium);
      color: var(--text-tertiary);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: var(--space-1);
    }

    .value {
      font-size: var(--text-sm);
      color: var(--text-primary);
    }

    .phone-with-whatsapp {
      display: flex;
      align-items: center;
      gap: var(--space-2);
    }

    .whatsapp-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: var(--space-1);
      background: #25D366;
      color: white;
      border-radius: var(--radius-full);
      transition: all var(--transition-fast);
      text-decoration: none;

      &:hover {
        background: #20BA5A;
        transform: scale(1.1);
      }

      &:active {
        transform: scale(0.95);
      }
    }
  }

  .empty-info {
    text-align: center;
    padding: var(--space-8) var(--space-4);
    color: var(--text-tertiary);
    font-size: var(--text-sm);
  }

  .notes {
    font-size: var(--text-sm);
    color: var(--text-secondary);
    line-height: 1.6;
    white-space: pre-wrap;
    margin: 0;
  }

  .policies-section {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .policies-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    > div {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }

    h2 {
      font-size: var(--text-xl);
      font-weight: var(--font-semibold);
      color: var(--text-primary);
      margin: 0;
    }
    
    .checkbox-label {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      cursor: pointer;
      user-select: none;
      
      input[type="checkbox"] {
        width: 16px;
        height: 16px;
        cursor: pointer;
      }
      
      span {
        font-size: var(--text-sm);
        color: var(--text-secondary);
        font-weight: var(--font-medium);
      }
    }
  }

  .policy-number {
    color: var(--primary-600);
    font-weight: var(--font-medium);
  }

  .date-cell {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    color: var(--text-secondary);
  }

  .clickable-row {
    cursor: pointer;
    transition: background-color var(--transition-fast);

    &:hover {
      background-color: var(--bg-secondary);
    }
  }

  @media (max-width: 768px) {
    .page-header {
      h1 {
        font-size: var(--text-2xl);
      }
    }

    .info-grid {
      grid-template-columns: 1fr;
    }

    .policies-header {
      flex-direction: column;
      align-items: flex-start;
      gap: var(--space-3);
    }
  }
</style>
