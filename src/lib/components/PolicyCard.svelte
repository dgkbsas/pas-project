<script lang="ts">
	import Badge from '$lib/components/ui/Badge.svelte';
	import { Calendar, User, Eye, Trash } from 'lucide-svelte';
	
	let {
		policy,
		index,
		onView,
		onDelete
	}: {
		policy: any;
		index: number;
		onView: (id: string) => void;
		onDelete: (id: string, number: string) => void;
	} = $props();
	
	function getStatusBadge(active: boolean, expiryDate: string): { variant: 'error' | 'success' | 'info' | 'warning' | 'default'; label: string } {
		if (!active) {
			return { variant: 'error' as const, label: 'Inactiva' };
		}

		const expiry = new Date(expiryDate);
		const today = new Date();

		if (expiry < today) {
			return { variant: 'warning' as const, label: 'Vencida' };
		}

		return { variant: 'success' as const, label: 'Activa' };
	}
	
	function getDaysUntilExpiry(expiryDate: string) {
		const today = new Date();
		const expiry = new Date(expiryDate);
		const diff = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
		return diff;
	}
	
	function formatDate(date: string) {
		return new Date(date).toLocaleDateString('es-ES', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}
	
	const statusBadge = $derived(getStatusBadge(policy.active, policy.expiry_date));
	const daysUntil = $derived(getDaysUntilExpiry(policy.expiry_date));
	const clientName = $derived(policy.client ? `${policy.client.first_name} ${policy.client.last_name}` : 'Cliente no disponible');
</script>

<div class="policy-card">
	<div class="card-header">
		<span class="card-number">#{index + 1}</span>
		<Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
	</div>
	
	<div class="card-body">
		<div class="policy-number">{policy.policy_number || 'S/N'}</div>
		<div class="policy-type">{policy.policy_type}</div>
		
		<div class="card-info">
			<div class="info-item">
				<User size={14} />
				<span>{clientName}</span>
			</div>
			<div class="info-item">
				<Calendar size={14} />
				<span>{formatDate(policy.expiry_date)}</span>
				{#if daysUntil <= 30 && daysUntil > 0}
					<span class="expiry-badge">{daysUntil}d</span>
				{/if}
			</div>
		</div>
	</div>
	
	<div class="card-actions">
		<button class="action-btn" onclick={() => onView(policy.id)} title="Ver">
			<Eye size={16} />
		</button>
		<button class="action-btn danger" onclick={() => onDelete(policy.id, policy.policy_number || 'esta póliza')} title="Eliminar">
			<Trash size={16} />
		</button>
	</div>
</div>

<style>
	.policy-card {
		background: var(--bg-primary);
		border: 1px solid var(--border-primary);
		border-radius: var(--radius-md);
		padding: var(--space-4);
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}
	
	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	
	.card-number {
		font-size: var(--text-xs);
		color: var(--text-tertiary);
		font-weight: var(--font-semibold);
	}
	
	.card-body {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}
	
	.policy-number {
		font-size: var(--text-lg);
		font-weight: var(--font-bold);
		color: var(--primary-600);
	}
	
	.policy-type {
		font-size: var(--text-sm);
		color: var(--text-secondary);
	}
	
	.card-info {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		margin-top: var(--space-2);
	}
	
	.info-item {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		font-size: var(--text-sm);
		color: var(--text-secondary);
	}
	
	.expiry-badge {
		padding: var(--space-1) var(--space-2);
		background: var(--warning-100);
		color: var(--warning-700);
		font-size: var(--text-xs);
		font-weight: var(--font-semibold);
		border-radius: var(--radius-full);
		margin-left: auto;
	}
	
	.card-actions {
		display: flex;
		gap: var(--space-2);
		padding-top: var(--space-2);
		border-top: 1px solid var(--border-primary);
	}
	
	.action-btn {
		flex: 1;
		height: 36px;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 1px solid var(--border-primary);
		background: transparent;
		color: var(--text-secondary);
		border-radius: var(--radius-sm);
		cursor: pointer;
		transition: all var(--transition-fast);
		
		&:hover {
			background: var(--bg-secondary);
			color: var(--primary-600);
			border-color: var(--primary-500);
		}
		
		&.danger:hover {
			background: var(--error-50);
			color: var(--error-600);
			border-color: var(--error-500);
		}
	}
</style>
