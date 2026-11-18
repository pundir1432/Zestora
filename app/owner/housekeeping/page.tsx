'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useHospitality } from '@/context/HospitalityContext';
import { HousekeepingTask } from '@/mock/rooms';
import { MdOutlineCleaningServices } from 'react-icons/md';
import { BiCheckCircle, BiTimeFive, BiWrench } from 'react-icons/bi';

export default function HousekeepingPage() {
  const { housekeepingTasks, updateHousekeepingStatus, rooms, updateRoomStatus } = useHospitality();
  const [filter, setFilter] = useState<'All' | HousekeepingTask['status']>('All');

  const filtered = filter === 'All' ? housekeepingTasks : housekeepingTasks.filter(t => t.status === filter);
  const dirtyRooms = rooms.filter(r => r.status === 'Dirty' || r.status === 'Cleaning' || r.status === 'Out of Order');

  return (
    <DashboardLayout allowedRoles={['restaurant_owner', 'branch_manager']}>
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-2 mb-4">
        <div>
          <h3 className="fw-bold text-navy mb-1 d-flex align-items-center gap-2">
            <MdOutlineCleaningServices className="text-brand" /> Housekeeping &amp; Maintenance
          </h3>
          <p className="text-muted-custom small mb-0">
            Room, Hostel Dorm Bed &amp; Camp Tent turnaround workflow: Dirty &rarr; Cleaning &rarr; Inspecting &rarr; Clean
          </p>
        </div>
      </div>

      {/* Room Status Action Strip */}
      <div className="app-card p-3 mb-4">
        <div className="fw-bold text-navy small mb-2">Units Needing Housekeeping / Maintenance Attention ({dirtyRooms.length})</div>
        <div className="row g-2">
          {dirtyRooms.map(rm => (
            <div key={rm.id} className="col-12 col-sm-6 col-lg-4">
              <div className="p-3 rounded-3 bg-surface border border-subtle d-flex align-items-center justify-content-between gap-2">
                <div>
                  <div className="fw-bold text-navy small">Room {rm.roomNumber} • {rm.roomType}</div>
                  <div className="text-muted-custom" style={{ fontSize: '11px' }}>Status: <strong>{rm.status}</strong> &bull; {rm.housekeeperAssigned}</div>
                </div>
                {rm.status === 'Dirty' && (
                  <button type="button" onClick={() => updateRoomStatus(rm.id, 'Cleaning')} className="btn btn-warning btn-sm fw-semibold">
                    Start Clean
                  </button>
                )}
                {rm.status === 'Cleaning' && (
                  <button type="button" onClick={() => updateRoomStatus(rm.id, 'Clean')} className="btn btn-success btn-sm text-white fw-semibold">
                    Mark Clean
                  </button>
                )}
                {rm.status === 'Out of Order' && (
                  <button type="button" onClick={() => updateRoomStatus(rm.id, 'Available', '')} className="btn btn-dark btn-sm fw-semibold">
                    Release OOO
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Pills */}
      <div className="d-flex gap-2 flex-wrap mb-3">
        {(['All', 'Pending', 'In Progress', 'Inspecting', 'Completed'] as const).map(st => (
          <button
            key={st}
            type="button"
            onClick={() => setFilter(st)}
            className={`btn btn-sm rounded-pill px-3 ${filter === st ? 'btn-brand text-white fw-semibold' : 'btn-outline-secondary bg-white text-navy'}`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Tasks List */}
      <div className="row g-3">
        {filtered.map(task => (
          <div key={task.id} className="col-12 col-md-6">
            <div className="app-card p-4 h-100 d-flex flex-column justify-content-between">
              <div>
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <span className="badge bg-light text-navy border me-1" style={{ fontSize: '10px' }}>{task.targetType}</span>
                    <span className={`badge ${task.priority === 'Urgent' ? 'badge-soft-danger' : task.priority === 'High' ? 'badge-soft-warning' : 'badge-soft-info'}`} style={{ fontSize: '10px' }}>
                      {task.priority}
                    </span>
                    <h6 className="fw-bold text-navy mt-1 mb-0">{task.targetName}</h6>
                  </div>
                  <span className={`badge rounded-pill ${
                    task.status === 'Completed' ? 'badge-soft-success'
                    : task.status === 'In Progress' ? 'badge-soft-warning'
                    : 'badge-soft-danger'
                  }`}>
                    {task.status}
                  </span>
                </div>

                <div className="small fw-semibold text-brand mb-1 d-flex align-items-center gap-1">
                  {task.taskType === 'Maintenance Repair' ? <BiWrench /> : <BiTimeFive />} {task.taskType}
                </div>
                {task.notes && <p className="text-muted-custom small mb-2">{task.notes}</p>}
              </div>

              <div className="pt-2 border-top d-flex align-items-center justify-content-between gap-2">
                <span className="text-muted-custom" style={{ fontSize: '11px' }}>
                  Staff: <strong>{task.assignedTo}</strong> &bull; {task.createdAt}
                </span>
                <div className="d-flex gap-1">
                  {task.status === 'Pending' && (
                    <button type="button" onClick={() => updateHousekeepingStatus(task.id, 'In Progress')} className="btn btn-sm btn-warning fw-semibold">
                      Start
                    </button>
                  )}
                  {task.status === 'In Progress' && (
                    <button type="button" onClick={() => updateHousekeepingStatus(task.id, 'Completed')} className="btn btn-sm btn-success text-white fw-semibold d-flex align-items-center gap-1">
                      <BiCheckCircle /> Complete
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
