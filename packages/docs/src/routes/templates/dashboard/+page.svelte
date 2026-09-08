<script lang="ts">
  import {
    LayoutDashboard,
    Calendar as CalendarIcon,
    Table as TableIcon,
    Kanban as BoardIcon,
    Users,
    FileText,
    TrendingUp,
    Clock,
    Plus,
    CheckCircle2
  } from 'lucide-svelte';
  import { Button, Card, Badge, StatCard } from '@intinyagroup/ui';
  import { DataTable, type ColumnDef } from '@intinyagroup/data-table';
  import { EventCalendar, type CalendarEvent } from '@intinyagroup/calendar';
  import { NotionDatabase, type DatabaseProperty } from '@intinyagroup/notion-database';

  interface ProjectTask {
    id: string;
    title: string;
    status: 'To Do' | 'In Progress' | 'Done';
    priority: 'Low' | 'Medium' | 'High';
    date: string;
    owner: string;
    budget: string;
  }

  const properties: DatabaseProperty[] = [
    { key: 'title', label: 'Feature / Task', type: 'title' },
    {
      key: 'status',
      label: 'Status',
      type: 'status',
      options: [
        { value: 'To Do', label: 'To Do', color: '#64748b' },
        { value: 'In Progress', label: 'In Progress', color: '#2563eb' },
        { value: 'Done', label: 'Done', color: '#059669' }
      ]
    },
    { key: 'priority', label: 'Priority', type: 'select' },
    { key: 'date', label: 'Target Date', type: 'date' },
    { key: 'owner', label: 'Owner', type: 'text' },
    { key: 'budget', label: 'Budget', type: 'number' }
  ];

  let roadmapItems = $state<ProjectTask[]>([
    { id: '1', title: 'Q3 Mobile App Launch', status: 'In Progress', priority: 'High', date: '2026-09-15', owner: 'Joshua', budget: 'Rp 45.000.000' },
    { id: '2', title: 'Design System Migration to Ark UI', status: 'Done', priority: 'Medium', date: '2026-09-02', owner: 'Budi Santoso', budget: 'Rp 15.000.000' },
    { id: '3', title: 'Postgres Vector Tuning', status: 'To Do', priority: 'High', date: '2026-09-28', owner: 'Alex Wong', budget: 'Rp 20.000.000' },
    { id: '4', title: 'Auth0 to Supabase Cutover', status: 'In Progress', priority: 'High', date: '2026-09-12', owner: 'Dewi Lestari', budget: 'Rp 30.000.000' },
    { id: '5', title: 'Dark Theme Color Calibration', status: 'Done', priority: 'Low', date: '2026-09-01', owner: 'Siti Rahma', budget: 'Rp 8.000.000' }
  ]);

  const now = new Date();
  let calendarEvents = $state<CalendarEvent[]>([
    {
      id: 'e1',
      title: 'Sprint Planning & Grooming',
      start: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 30),
      end: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 11, 0),
      color: '#2563eb'
    },
    {
      id: 'e2',
      title: 'Design Critique & UI Audit',
      start: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 14, 0),
      end: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 15, 30),
      color: '#7c3aed'
    }
  ]);
</script>

<svelte:head>
  <title>Enterprise Project Management Showcase — Intinya UI</title>
</svelte:head>

<div class="min-h-screen bg-[var(--ui-background)] text-[var(--ui-foreground)] p-6 space-y-8 max-w-7xl mx-auto">
  <!-- Top Welcome Header -->
  <div class="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[var(--ui-border)]">
    <div>
      <h1 class="text-2xl font-black tracking-tight">Enterprise Engineering Hub</h1>
      <p class="text-sm text-[var(--ui-muted-foreground)] mt-1">
        Demonstrasi integrasi multi-komponen: NotionDatabase, EventCalendar, dan DataTable dalam satu dashboard.
      </p>
    </div>

    <div class="flex items-center gap-2">
      <Button variant="outline" size="sm" class="gap-1.5 font-semibold">
        <FileText class="size-3.5" /> Export Report
      </Button>
      <Button size="sm" class="gap-1.5 font-semibold">
        <Plus class="size-3.5" /> Create Project
      </Button>
    </div>
  </div>

  <!-- Stat Cards Grid -->
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
    <StatCard
      label="Total Active Sprints"
      value="12 Sprints"
      change={14}
      changeLabel="vs last month"
    />
    <StatCard
      label="Tasks Completed"
      value="148 Tasks"
      change={28}
      changeLabel="velocity rate"
    />
    <StatCard
      label="Engineering Budget"
      value="Rp 118.000.000"
      change={-5}
      changeLabel="spent to date"
    />
    <StatCard
      label="On-Time Delivery"
      value="96.4%"
      change={2.1}
      changeLabel="quarterly score"
    />
  </div>

  <!-- Showcase 1: Notion Multi-View Database (Table, Kanban, Calendar, Gallery) -->
  <div class="space-y-3">
    <div class="flex items-center justify-between">
      <h2 class="text-base font-bold flex items-center gap-2">
        <LayoutDashboard class="size-4 text-[var(--ui-primary)]" />
        1. Unified Notion Database (Multi-View Switcher)
      </h2>
      <Badge variant="outline" class="text-xs">
        Table • Board • Calendar • Gallery
      </Badge>
    </div>

    <NotionDatabase
      title="Engineering Product Roadmap"
      icon="🚀"
      items={roadmapItems}
      {properties}
      activeView="table"
      onItemClick={(item) => alert(`Selected Task: ${item.title}`)}
    />
  </div>

  <!-- Showcase 2: Event Calendar (Google Calendar Suite) -->
  <div class="space-y-3">
    <div class="flex items-center justify-between">
      <h2 class="text-base font-bold flex items-center gap-2">
        <CalendarIcon class="size-4 text-[var(--ui-primary)]" />
        2. Google Calendar Event Scheduler (with Red Line & Timezone)
      </h2>
      <Badge variant="secondary" class="text-xs">
        Drag-to-reschedule active
      </Badge>
    </div>

    <div class="h-[620px] w-full">
      <EventCalendar
        bind:events={calendarEvents}
        view="week"
        timeZone="Asia/Jakarta"
        locale="id-ID"
        firstDayOfWeek={1}
        enableEventModal={true}
      />
    </div>
  </div>
</div>
