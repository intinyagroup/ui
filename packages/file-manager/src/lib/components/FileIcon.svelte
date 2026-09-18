<script lang="ts">
  import {
    Folder,
    FileText,
    FileImage,
    FileVideo,
    FileAudio,
    FileSpreadsheet,
    FileCode,
    FileArchive,
    File as FileDefault,
  } from "lucide-svelte";
  import { getFileCategory, type FileCategory } from "../file-model.js";

  let {
    type = "file",
    name = "",
    mimeType,
    class: className = "size-5",
  }: {
    type: "file" | "folder";
    name: string;
    mimeType?: string;
    class?: string;
  } = $props();

  const category = $derived(getFileCategory({ type, name, mimeType }));
</script>

{#if category === "folder"}
  <Folder class="{className} text-amber-500 fill-amber-500/20" />
{:else if category === "pdf"}
  <FileText class="{className} text-red-500" />
{:else if category === "image"}
  <FileImage class="{className} text-emerald-500" />
{:else if category === "video"}
  <FileVideo class="{className} text-purple-500" />
{:else if category === "audio"}
  <FileAudio class="{className} text-pink-500" />
{:else if category === "spreadsheet"}
  <FileSpreadsheet class="{className} text-teal-600" />
{:else if category === "code"}
  <FileCode class="{className} text-blue-500" />
{:else if category === "archive"}
  <FileArchive class="{className} text-orange-500" />
{:else if category === "document"}
  <FileText class="{className} text-blue-600" />
{:else}
  <FileDefault class="{className} text-muted-foreground" />
{/if}
