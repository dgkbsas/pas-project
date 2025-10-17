<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import Card from "$lib/components/ui/Card.svelte";
  import Badge from "$lib/components/ui/Badge.svelte";
  import EmptyState from "$lib/components/ui/EmptyState.svelte";
  import {
    Bell,
    AlertCircle,
    Calendar,
    FileText,
    ChevronRight,
  } from "lucide-svelte";

  interface Notification {
    id: string;
    type: "followup_alert" | "policy_expiration";
    date: string;
    title: string;
    description: string;
    policy: {
      id: string;
      policy_number: string | null;
      policy_type: string;
    };
    client: {
      id: string;
      name: string;
    };
    followup?: {
      id: string;
      type: string;
      date: string;
    };
    daysUntilExpiry?: number;
  }

  let notifications = $state<Notification[]>([]);
  let loading = $state(true);
  let error = $state<string | null>(null);

  async function loadNotifications() {
    loading = true;
    error = null;

    try {
      const response = await fetch("/api/notifications");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al cargar notificaciones");
      }

      notifications = data.notifications || [];
    } catch (err: any) {
      error = err.message || "Error al cargar notificaciones";
      console.error("Error loading notifications:", err);
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    loadNotifications();
  });

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  function getNotificationIcon(type: string) {
    return type === "followup_alert" ? Bell : AlertCircle;
  }

  function getNotificationVariant(
    notification: Notification
  ): "warning" | "error" | "info" {
    if (notification.type === "policy_expiration") {
      if (notification.daysUntilExpiry! <= 7) return "error";
      if (notification.daysUntilExpiry! <= 15) return "warning";
      return "info";
    }
    return "info";
  }

  function handleNotificationClick(notification: Notification) {
    // Open policy modal
    goto(`/polizas?policyId=${notification.policy.id}&mode=view`);
  }

  function getDaysText(notification: Notification): string {
    const notificationDate = new Date(notification.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    notificationDate.setHours(0, 0, 0, 0);

    const daysUntil = Math.floor(
      (notificationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysUntil === 0) return "Hoy";
    if (daysUntil === 1) return "Mañana";
    if (daysUntil < 0)
      return `Hace ${Math.abs(daysUntil)} ${Math.abs(daysUntil) === 1 ? "día" : "días"}`;
    return `En ${daysUntil} ${daysUntil === 1 ? "día" : "días"}`;
  }
</script>

<Card>
  <div class="notifications-header">
    <div class="header-title">
      <Bell size={20} />
      <h2>Notificaciones</h2>
    </div>
    {#if notifications.length > 0}
      <Badge variant="info">{notifications.length}</Badge>
    {/if}
  </div>

  <div class="notifications-content">
    {#if loading}
      <div class="loading-state">
        <div class="spinner"></div>
        <p>Cargando notificaciones...</p>
      </div>
    {:else if error}
      <div class="error-state">
        <AlertCircle size={48} />
        <p>{error}</p>
      </div>
    {:else if notifications.length === 0}
      <EmptyState
        icon={Bell}
        title="Sin notificaciones"
        description="No tienes notificaciones pendientes"
      />
    {:else}
      <div class="notifications-list">
        {#each notifications as notification}
          {@const Icon = getNotificationIcon(notification.type)}
          {@const variant = getNotificationVariant(notification)}

          <button
            class="notification-item {variant}"
            onclick={() => handleNotificationClick(notification)}
          >
            <div class="notification-icon">
              <Icon size={18} />
            </div>

            <div class="notification-content">
              <div class="notification-header">
                <span class="notification-title">{notification.title}</span>
                <span class="notification-date"
                  >{getDaysText(notification)}</span
                >
              </div>

              <p class="notification-description">{notification.description}</p>

              <div class="notification-meta">
                <span class="client-name">{notification.client.name}</span>
                <span class="separator">•</span>
                <span class="policy-type"
                  >{notification.policy.policy_type}</span
                >
              </div>
            </div>

            <div class="notification-arrow">
              <ChevronRight size={16} />
            </div>
          </button>
        {/each}
      </div>
    {/if}
  </div>
</Card>

<style lang="scss">
  .notifications-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-4);
    padding-bottom: var(--space-3);
    border-bottom: 1px solid var(--border-primary);

    .header-title {
      display: flex;
      align-items: center;
      gap: var(--space-2);

      :global(svg) {
        color: var(--primary-600);
      }

      h2 {
        margin: 0;
        font-size: var(--text-lg);
        font-weight: var(--font-semibold);
        color: var(--text-primary);
      }
    }
  }

  .notifications-content {
    min-height: 200px;
  }

  .loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: var(--space-8);
    gap: var(--space-4);

    .spinner {
      width: 32px;
      height: 32px;
      border: 3px solid var(--border-primary);
      border-top-color: var(--primary-600);
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    p {
      margin: 0;
      color: var(--text-tertiary);
      font-size: var(--text-sm);
    }
  }

  .error-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: var(--space-8);
    gap: var(--space-3);

    :global(svg) {
      color: var(--error-500);
    }

    p {
      margin: 0;
      color: var(--text-secondary);
      text-align: center;
    }
  }

  .notifications-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .notification-item {
    display: flex;
    gap: var(--space-3);
    padding: var(--space-3);
    border-radius: var(--radius-md);
    border: 1px solid var(--border-primary);
    background: var(--bg-primary);
    cursor: pointer;
    transition: all var(--transition-fast);

    &:hover {
      background: var(--bg-secondary);
      border-color: var(--primary-300);
      transform: translateX(4px);
    }

    &.error {
      border-left: 3px solid var(--error-500);

      .notification-icon {
        color: var(--error-600);
      }
    }

    &.warning {
      border-left: 3px solid var(--warning-500);

      .notification-icon {
        color: var(--warning-600);
      }
    }

    &.info {
      border-left: 3px solid var(--info-500);

      .notification-icon {
        color: var(--info-600);
      }
    }
  }

  .notification-icon {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-2);
  }

  .notification-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .notification-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: var(--space-2);
  }

  .notification-title {
    font-weight: var(--font-semibold);
    color: var(--text-primary);
    font-size: var(--text-sm);
  }

  .notification-date {
    font-size: var(--text-xs);
    color: var(--text-tertiary);
    white-space: nowrap;
  }

  .notification-description {
    margin: 0;
    font-size: var(--text-sm);
    color: var(--text-secondary);
    line-height: 1.4;
  }

  .notification-meta {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    font-size: var(--text-xs);
    color: var(--text-tertiary);

    .separator {
      color: var(--border-primary);
    }

    .client-name {
      font-weight: var(--font-medium);
    }
  }

  .notification-arrow {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    color: var(--text-tertiary);
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  @media (max-width: 768px) {
    .notifications-header {
      .header-title {
        h2 {
          font-size: var(--text-base);
        }
      }
    }

    .notification-item {
      &:hover {
        transform: none;
      }
    }
  }
</style>
