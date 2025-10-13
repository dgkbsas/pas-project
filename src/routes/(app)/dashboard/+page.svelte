<script lang="ts">
  import Card from "$lib/components/ui/Card.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import Badge from "$lib/components/ui/Badge.svelte";
  import {
    Users,
    FileText,
    AlertCircle,
    TrendingUp,
    Plus,
  } from "lucide-svelte";
  import { fade, fly } from "svelte/transition";
  import type { Client, Policy } from "$lib/types/database.types";

  type RecentClient = Pick<Client, 'id' | 'first_name' | 'last_name' | 'created_at'>;
  type RecentPolicy = Pick<Policy, 'id' | 'policy_number' | 'policy_type' | 'created_at'> & {
    clients?: Pick<Client, 'first_name' | 'last_name'> | null;
  };

  type PageData = {
    userProfile: {
      full_name?: string;
    };
    stats: {
      clientsCount: number;
      activePoliciesCount: number;
      expiringPoliciesCount: number;
      renewalsThisMonthCount: number;
    };
    recentActivity: {
      clients: RecentClient[];
      policies: RecentPolicy[];
    };
  };

  let { data } = $props<{ data: PageData }>();

  function formatTimeAgo(date: string) {
    const now = new Date();
    const then = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);

    if (diffInSeconds < 60) return "Hace un momento";
    if (diffInSeconds < 3600)
      return `Hace ${Math.floor(diffInSeconds / 60)} minutos`;
    if (diffInSeconds < 86400)
      return `Hace ${Math.floor(diffInSeconds / 3600)} horas`;
    if (diffInSeconds < 604800)
      return `Hace ${Math.floor(diffInSeconds / 86400)} días`;
    return then.toLocaleDateString("es-ES", { month: "short", day: "numeric" });
  }

  // Estadísticas dinámicas desde la base de datos
  const stats = $derived([
    {
      title: "Clientes Activos",
      value: data.stats.clientsCount.toString(),
      icon: Users,
      color: "primary",
    },
    {
      title: "Pólizas Vigentes",
      value: data.stats.activePoliciesCount.toString(),
      icon: FileText,
      color: "success",
    },
    {
      title: "Por Vencer (30 días)",
      value: data.stats.expiringPoliciesCount.toString(),
      icon: AlertCircle,
      color: "warning",
    },
    {
      title: "Renovaciones Este Mes",
      value: data.stats.renewalsThisMonthCount.toString(),
      icon: TrendingUp,
      color: "info",
    },
  ]);

  // Actividad reciente desde la base de datos
  const recentActivities = $derived(
    [
      ...data.recentActivity.clients.map((client: RecentClient) => ({
        type: "new_client",
        title: "Nuevo cliente registrado",
        description: `${client.first_name} ${client.last_name}`,
        time: formatTimeAgo(client.created_at),
        icon: Users,
      })),
      ...data.recentActivity.policies.map((policy: RecentPolicy) => ({
        type: "new_policy",
        title: "Nueva póliza creada",
        description:
          `${policy.policy_type} - ${policy.clients?.first_name || ""} ${policy.clients?.last_name || ""}`.trim() ||
          "Cliente",
        time: formatTimeAgo(policy.created_at),
        icon: FileText,
      })),
    ]
      .sort((a, b) => {
        // Ordenar por fecha de creación
        const clientDescA = data.recentActivity.clients.find(
          (c: RecentClient) => a.description === `${c.first_name} ${c.last_name}`
        );
        const policyDescA = data.recentActivity.policies.find((p: RecentPolicy) =>
          a.description.includes(p.policy_type)
        );
        const dateA = clientDescA?.created_at || policyDescA?.created_at || "";

        const clientDescB = data.recentActivity.clients.find(
          (c: RecentClient) => b.description === `${c.first_name} ${c.last_name}`
        );
        const policyDescB = data.recentActivity.policies.find((p: RecentPolicy) =>
          b.description.includes(p.policy_type)
        );
        const dateB = clientDescB?.created_at || policyDescB?.created_at || "";

        return new Date(dateB).getTime() - new Date(dateA).getTime();
      })
      .slice(0, 5)
  );

  const quickActions = [
    { label: "Nuevo Cliente", href: "/clientes/nuevo", icon: Users },
    { label: "Nueva Póliza", href: "/polizas/nuevo", icon: FileText },
    { label: "Ver Pólizas", href: "/polizas", icon: AlertCircle },
  ];
</script>

<svelte:head>
  <title>Dashboard - PAS Manager</title>
</svelte:head>

<div class="dashboard">
  <div class="dashboard-header">
    <div>
      <h1>Dashboard</h1>
      <p>Bienvenido de vuelta, {data.userProfile?.full_name || "Usuario"}</p>
    </div>
  </div>

  <!-- Stats Grid -->
  <div class="stats-grid" in:fade={{ duration: 300, delay: 100 }}>
    {#each stats as stat, i}
      {@const Icon = stat.icon}
      <div in:fly={{ y: 20, duration: 300, delay: 100 + i * 50 }}>
        <Card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon stat-icon-{stat.color}">
              <Icon size={24} />
            </div>
            <div class="stat-details">
              <div class="stat-label">{stat.title}</div>
              <div class="stat-value">{stat.value}</div>
            </div>
          </div>
        </Card>
      </div>
    {/each}
  </div>

  <!-- Quick Actions -->
  <div class="quick-actions" in:fade={{ duration: 300, delay: 300 }}>
    <h2>Acciones Rápidas</h2>
    <div class="actions-grid">
      {#each quickActions as action}
        {@const Icon = action.icon}
        <a href={action.href} class="action-card">
          <Icon size={20} />
          <span>{action.label}</span>
        </a>
      {/each}
    </div>
  </div>

  <!-- Recent Activity -->
  <div class="recent-section" in:fade={{ duration: 300, delay: 400 }}>
    <Card>
      {#snippet header()}
        <h2>Actividad Reciente</h2>
      {/snippet}

      <div class="activity-list">
        {#each recentActivities as activity}
          {@const Icon = activity.icon}
          <div class="activity-item">
            <div class="activity-icon">
              <Icon size={18} />
            </div>
            <div class="activity-content">
              <div class="activity-title">{activity.title}</div>
              <div class="activity-description">{activity.description}</div>
            </div>
            <div class="activity-time">{activity.time}</div>
          </div>
        {/each}
      </div>

      {#snippet footer()}
        <Button variant="ghost" size="sm">Ver todas las actividades</Button>
      {/snippet}
    </Card>
  </div>
</div>

<style lang="scss">
  @use "$lib/styles/mixins" as *;

  .dashboard {
    margin: 0 auto;
  }

  .dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: var(--space-8);

    h1 {
      font-size: var(--text-3xl);
      font-weight: var(--font-bold);
      color: var(--text-primary);
      margin: 0 0 var(--space-2);
    }

    p {
      font-size: var(--text-base);
      color: var(--text-secondary);
      margin: 0;
    }
  }

  // Stats Grid
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: var(--space-4);
    margin-bottom: var(--space-6);

    @include responsive(lg-down) {
      grid-template-columns: repeat(2, 1fr);
    }

    @include responsive(sm-down) {
      grid-template-columns: 1fr;
      gap: var(--space-3);
    }
  }

  :global(.stat-card) {
    height: 100%;
    padding: var(--space-5) !important;
    transition:
      transform var(--transition-fast),
      box-shadow var(--transition-fast);

    &:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }

    @include responsive(sm-down) {
      padding: var(--space-4) !important;
    }
  }

  .stat-content {
    display: flex;
    gap: var(--space-4);
    align-items: center;
  }

  .stat-icon {
    width: 48px;
    height: 48px;
    border-radius: var(--radius-lg);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    &.stat-icon-primary {
      background: var(--primary-100);
      color: var(--primary-600);
    }

    &.stat-icon-success {
      background: var(--success-50);
      color: var(--success-500);
    }

    &.stat-icon-warning {
      background: var(--warning-50);
      color: var(--warning-500);
    }

    &.stat-icon-info {
      background: var(--info-50);
      color: var(--info-500);
    }
  }

  /* Dark mode adjustments - @TODO: Implement when dark mode is active */
  /* svelte-ignore css-unused-selector */
  :global([data-theme="dark"]) .stat-icon.stat-icon-primary {
    background: rgba(139, 92, 246, 0.2);
    color: var(--primary-400);
  }

  /* svelte-ignore css-unused-selector */
  :global([data-theme="dark"]) .stat-icon.stat-icon-success {
    background: rgba(16, 185, 129, 0.2);
    color: var(--success-500);
  }

  /* svelte-ignore css-unused-selector */
  :global([data-theme="dark"]) .stat-icon.stat-icon-warning {
    background: rgba(245, 158, 11, 0.2);
    color: var(--warning-500);
  }

  /* svelte-ignore css-unused-selector */
  :global([data-theme="dark"]) .stat-icon.stat-icon-info {
    background: rgba(59, 130, 246, 0.2);
    color: var(--info-500);
  }

  .stat-details {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .stat-label {
    font-size: var(--text-xs);
    color: var(--text-tertiary);
    font-weight: var(--font-medium);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .stat-value {
    font-size: var(--text-2xl);
    font-weight: var(--font-bold);
    color: var(--text-primary);
    line-height: 1;

    @include responsive(lg-down) {
      font-size: var(--text-xl);
    }
  }

  .stat-change {
    font-size: var(--text-sm);
    font-weight: var(--font-medium);

    &.positive {
      color: var(--success-500);
    }

    &.negative {
      color: var(--error-500);
    }
  }

  // Quick Actions
  .quick-actions {
    margin-bottom: var(--space-8);

    h2 {
      font-size: var(--text-xl);
      font-weight: var(--font-semibold);
      color: var(--text-primary);
      margin: 0 0 var(--space-4);
    }
  }

  .actions-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--space-4);

    @include responsive(sm-down) {
      grid-template-columns: 1fr;
    }
  }

  .action-card {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-4);
    background: var(--bg-primary);
    border: 1px solid var(--border-primary);
    border-radius: var(--radius-md);
    color: var(--text-primary);
    text-decoration: none;
    font-size: var(--text-sm);
    font-weight: var(--font-medium);
    transition: all var(--transition-fast);

    &:hover {
      background: var(--primary-50);
      border-color: var(--primary-500);
      color: var(--primary-700);
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }
  }

  /* svelte-ignore css-unused-selector */
  :global([data-theme="dark"]) .action-card:hover {
    background: rgba(139, 92, 246, 0.1);
    color: var(--primary-400);
  }

  // Recent Activity
  .recent-section {
    h2 {
      font-size: var(--text-xl);
      font-weight: var(--font-semibold);
      color: var(--text-primary);
      margin: 0;
    }
  }

  .activity-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .activity-item {
    display: flex;
    align-items: flex-start;
    gap: var(--space-3);
    padding: var(--space-3);
    border-radius: var(--radius-md);
    transition: background-color var(--transition-fast);

    &:hover {
      background: var(--bg-secondary);
    }
  }

  .activity-icon {
    width: 40px;
    height: 40px;
    border-radius: var(--radius-md);
    background: var(--bg-secondary);
    color: var(--text-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .activity-content {
    flex: 1;
    min-width: 0;
  }

  .activity-title {
    font-size: var(--text-sm);
    font-weight: var(--font-medium);
    color: var(--text-primary);
    margin-bottom: var(--space-1);
  }

  .activity-description {
    font-size: var(--text-sm);
    color: var(--text-secondary);
  }

  .activity-time {
    font-size: var(--text-xs);
    color: var(--text-tertiary);
    flex-shrink: 0;
    white-space: nowrap;
  }
</style>
