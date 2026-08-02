<script lang="ts">
  import { PenLine, Check, X, Shield } from 'lucide-svelte';
  import { Button, Input } from '@intinyagroup/ui';
  import { cn } from '@intinyagroup/grid-core/utils';

  type SignatureData = {
    id: string;
    signerName: string;
    reason: string;
    location: string;
    date: string;
    imageData: string;
    pageNumber: number;
    x: number;
    y: number;
    width: number;
    height: number;
  };

  let {
    signatures = [],
    onAddSignature,
    onRemoveSignature,
    onApplySignature,
  }: {
    signatures: SignatureData[];
    onAddSignature: (sig: Omit<SignatureData, 'id'>) => void;
    onRemoveSignature: (id: string) => void;
    onApplySignature: (id: string) => void;
  } = $props();

  let showForm = $state(false);
  let signerName = $state('');
  let reason = $state('');
  let location = $state('');
  let signaturePad: HTMLCanvasElement | null = $state(null);
  let isDrawing = $state(false);
  let hasSignature = $state(false);

  function startDrawing(e: MouseEvent) {
    if (!signaturePad) return;
    isDrawing = true;
    const ctx = signaturePad.getContext('2d');
    if (!ctx) return;
    const rect = signaturePad.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  }

  function draw(e: MouseEvent) {
    if (!isDrawing || !signaturePad) return;
    const ctx = signaturePad.getContext('2d');
    if (!ctx) return;
    const rect = signaturePad.getBoundingClientRect();
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000';
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
    hasSignature = true;
  }

  function stopDrawing() {
    isDrawing = false;
  }

  function clearSignature() {
    if (!signaturePad) return;
    const ctx = signaturePad.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, signaturePad.width, signaturePad.height);
    hasSignature = false;
  }

  function saveSignature() {
    if (!signaturePad || !hasSignature) return;
    const imageData = signaturePad.toDataURL('image/png');
    onAddSignature({
      signerName: signerName || 'Anonymous',
      reason: reason || 'Document approval',
      location: location || '',
      date: new Date().toISOString(),
      imageData,
      pageNumber: 1,
      x: 100,
      y: 100,
      width: 200,
      height: 80,
    });
    showForm = false;
    signerName = '';
    reason = '';
    location = '';
    clearSignature();
  }
</script>

<div class="space-y-4">
  <div class="flex items-center gap-2">
    <Shield class="size-5 text-[var(--ui-primary)]" />
    <h3 class="text-sm font-semibold text-[var(--ui-foreground)]">Digital Signatures</h3>
  </div>

  <Button size="sm" onclick={() => showForm = !showForm} class="w-full">
    <PenLine class="size-4 mr-2" />
    {showForm ? 'Cancel' : 'Add Signature'}
  </Button>

  {#if showForm}
    <div class="space-y-3 p-3 rounded-lg border border-[var(--ui-border)] bg-[var(--ui-secondary)]/20">
      <Input bind:value={signerName} placeholder="Signer name" />
      <Input bind:value={reason} placeholder="Reason (optional)" />
      <Input bind:value={location} placeholder="Location (optional)" />

      <div class="text-xs text-[var(--ui-muted-foreground)] mb-1">Draw your signature:</div>
      <canvas
        bind:this={signaturePad}
        width={300}
        height={100}
        class="w-full border border-[var(--ui-border)] rounded-lg cursor-crosshair bg-white"
        onmousedown={startDrawing}
        onmousemove={draw}
        onmouseup={stopDrawing}
        onmouseleave={stopDrawing}
      ></canvas>

      <div class="flex gap-2">
        <Button variant="outline" size="sm" onclick={clearSignature} class="flex-1">Clear</Button>
        <Button size="sm" onclick={saveSignature} class="flex-1" disabled={!hasSignature}>
          <Check class="size-4 mr-1" /> Save
        </Button>
      </div>
    </div>
  {/if}

  <!-- Existing signatures -->
  {#if signatures.length > 0}
    <div class="space-y-2">
      <span class="text-xs text-[var(--ui-muted-foreground)]">Signatures ({signatures.length}):</span>
      {#each signatures as sig (sig.id)}
        <div class="p-2 rounded-lg border border-[var(--ui-border)] bg-[var(--ui-card)]">
          <div class="flex items-start gap-2">
            <img src={sig.imageData} alt="Signature" class="h-10 border rounded bg-white" />
            <div class="flex-1 min-w-0">
              <div class="text-sm font-medium text-[var(--ui-foreground)]">{sig.signerName}</div>
              <div class="text-[10px] text-[var(--ui-muted-foreground)]">
                {sig.reason} · {new Date(sig.date).toLocaleDateString()}
              </div>
            </div>
            <button onclick={() => onRemoveSignature(sig.id)} class="text-[var(--ui-destructive)] cursor-pointer">
              <X class="size-3.5" />
            </button>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
