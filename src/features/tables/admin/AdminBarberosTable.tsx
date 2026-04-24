import { useState } from "react";
import { showNotification } from "../../../lib/notifications";
import { FaPen, FaTrashAlt } from "react-icons/fa";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { CustomButton } from "../../../components/Button";
import { ConfirmacionEliminacion } from "@/components/ConfirmacionEliminacion";
import { useBarberosListQuery, useDeleteBarberMutation } from "@/hooks/useBarberos";
import { mensajePrimeraRespuestaLista } from "@/lib/respuesta-api";
import type { BarberoListadoDTO } from "@/services/barberosService";

function estadoBadgeClass(descripcion: string) {
  const d = descripcion.toLowerCase();
  if (d.includes("activ")) return "bg-emerald-100 text-emerald-700";
  if (d.includes("inactiv") || d.includes("baja"))
    return "bg-slate-200 text-slate-700";
  if (d.includes("pend")) return "bg-blue-100 text-blue-700";
  return "bg-blue-100 text-blue-700";
}


type AdminBarberosTableProps = {
  onEditBarbero?: (barbero: BarberoListadoDTO) => void
}

export function AdminBarberosTable({ onEditBarbero }: AdminBarberosTableProps) {
  const {
    data = [],
    isPending,
    isError,
    error,
    refetch,
  } = useBarberosListQuery();

  const deleteBarbero = useDeleteBarberMutation();
  const [deleteTarget, setDeleteTarget] = useState<BarberoListadoDTO | null>(null);

  const activeCount = data.filter((row) => row.estatus === 1).length;
  const inactiveCount = data.length - activeCount;

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    const id = deleteTarget.id;
    deleteBarbero.mutate(id, {
      onSuccess: (res) => {
        const { ok, mensaje } = mensajePrimeraRespuestaLista(res);
        if (ok) {
          showNotification({
            title: "Barberos",
            message: mensaje || "Barbero eliminado.",
            variant: "success",
          });
        } else {
          showNotification({
            title: "Barberos",
            message: mensaje || "No se pudo eliminar el barbero.",
            variant: "warning",
          });
        }
      },
      onError: (e) => {
        showNotification({
          title: "Barberos",
          message: e instanceof Error ? e.message : "Error al eliminar.",
          variant: "error",
        });
      },
      onSettled: () => setDeleteTarget(null),
    });
  };

  const columns: MRT_ColumnDef<BarberoListadoDTO>[] = [
    { accessorKey: "nombre", header: "Nombre" },
    { accessorKey: "nombreUsuario", header: "Usuario" },
    {
      accessorKey: "descripcionEstatus",
      header: "Estado",
      Cell: ({ row }) => (
        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${estadoBadgeClass(
            row.original.descripcionEstatus ?? "",
          )}`}
        >
          {row.original.descripcionEstatus ?? "—"}
        </span>
      ),
    },
  ];

  const table = useMaterialReactTable({
    columns,
    data,
    state: { isLoading: isPending, showProgressBars: isPending },
    enableRowActions: true,
    enableColumnActions: false,
    enableColumnFilters: true,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    enableHiding: false,
    enableGlobalFilter: true,
    enableRowSelection: false,
    positionActionsColumn: "last",
    initialState: {
      showColumnFilters: false,
      showGlobalFilter: true,
      pagination: { pageIndex: 0, pageSize: 5 },
    },
    paginationDisplayMode: "pages",
    displayColumnDefOptions: {
      "mrt-row-actions": { header: "Acciones", size: 140 },
    },
    renderTopToolbarCustomActions: () => (
      <span className="rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-[11px] font-semibold text-indigo-700">
        Datos desde obtenerBarberos
      </span>
    ),
    renderRowActions: ({ row }) => (
      <div className="inline-flex gap-2">
        <CustomButton
          type="button"
          variant="ghost"
          iconOnly
          tooltip="Editar"
          aria-label="Editar"
          className="h-8 w-8 rounded-md border border-transparent bg-slate-100/80 text-slate-500 transition hover:border-blue-200 hover:bg-blue-50/70 hover:text-blue-700"
          onClick={() =>
            onEditBarbero
              ? onEditBarbero(row.original)
              : showNotification({
                  title: "Barberos",
                  message: `Editar barbero: ${row.original.nombre} (id ${row.original.id}).`,
                  variant: "warning",
                })
          }
        >
          <FaPen className="h-3.5 w-3.5" />
        </CustomButton>
        <CustomButton
          type="button"
          variant="danger"
          iconOnly
          tooltip="Eliminar"
          aria-label="Eliminar"
          disabled={deleteBarbero.isPending}
          className="h-8 w-8 rounded-md border border-transparent bg-slate-100/80 text-slate-500 transition hover:border-rose-200 hover:bg-rose-50/70 hover:text-rose-700"
          onClick={() => setDeleteTarget(row.original)}
        >
          <FaTrashAlt className="h-3.5 w-3.5" />
        </CustomButton>
      </div>
    ),
    localization: {
      actions: "Acciones",
      noRecordsToDisplay: "No hay registros para mostrar",
      noResultsFound: "No se encontraron resultados",
      search: "Buscar",
      showHideFilters: "Mostrar/Ocultar filtros",
      rowsPerPage: "Filas por pagina",
      of: "de",
    },
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        border: "1px solid #e2e8f0",
        borderRadius: "1rem",
        overflow: "hidden",
        boxShadow: "0 16px 35px -28px rgba(59, 130, 246, 0.45)",
      },
    },
    muiTopToolbarProps: {
      sx: {
        background:
          "linear-gradient(90deg, rgba(238,242,255,0.88) 0%, rgba(255,255,255,0.95) 60%, rgba(241,245,249,0.9) 100%)",
        borderBottom: "1px solid #e2e8f0",
        px: "0.9rem",
        py: "0.4rem",
        minHeight: "3.2rem",
      },
    },
    muiTableHeadCellProps: {
      sx: {
        backgroundColor: "#eef2ff",
        color: "#1e293b",
        fontWeight: 700,
        fontSize: "0.75rem",
        borderBottom: "1px solid #e2e8f0",
        position: "sticky",
        top: 0,
        zIndex: 2,
      },
    },
    muiTableBodyRowProps: ({ row }) => ({
      sx: {
        backgroundColor: row.index % 2 === 0 ? "#ffffff" : "#f8fafc",
        transition: "all .18s ease",
        "&:hover td": { backgroundColor: "#e9efff" },
        "&:hover": { transform: "translateY(-1px)", boxShadow: "0 8px 18px -16px rgba(79,70,229,.8)" },
      },
    }),
    muiTableBodyCellProps: {
      sx: { borderBottom: "1px solid #e2e8f0", fontSize: "0.835rem" },
    },
    muiSearchTextFieldProps: {
      placeholder: "Buscar por nombre, usuario o estado...",
      size: "small",
      sx: {
        minWidth: "300px",
        "& .MuiOutlinedInput-root": {
          borderRadius: "999px",
          backgroundColor: "#ffffff",
          border: "1px solid #e2e8f0",
          boxShadow: "0 1px 0 rgba(15,23,42,.02)",
        },
      },
    },
    muiPaginationProps: {
      rowsPerPageOptions: [5, 10, 20],
      showFirstButton: true,
      showLastButton: true,
    },
  });

  return (
    <section className="rounded-3xl border border-slate-200/80 bg-linear-to-br from-white via-white to-indigo-50/20 shadow-sm shadow-blue-100/40">
      <div className="border-b border-slate-200 bg-linear-to-r from-slate-50 via-white to-indigo-50/50 px-5 py-4">
        <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
          Barberos y servicios
        </h2>
        <p className="mt-1 text-xs text-slate-500 sm:text-sm">
          Listado desde la API. Las columnas de especialidad o servicios
          asignados requieren que el backend las exponga en el DTO.
        </p>
        {isError ? (
          <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">
            <p>
              {error instanceof Error
                ? error.message
                : "No se pudo cargar el listado."}
            </p>
            <CustomButton
              type="button"
              variant="secondary"
              size="sm"
              className="mt-2 rounded-lg"
              onClick={() => void refetch()}
            >
              Reintentar
            </CustomButton>
          </div>
        ) : null}
        <div className="mt-4 rounded-2xl border border-slate-200 bg-white/90 p-3 shadow-sm">
          <div className="mb-2 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wide">
            <span className="text-slate-500">Resumen del equipo</span>
            <span className="text-slate-700">{data.length} perfiles</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-linear-to-r from-blue-500 via-indigo-500 to-blue-600"
              style={{
                width: `${data.length ? (activeCount / data.length) * 100 : 0}%`,
              }}
            />
          </div>
          <div className="mt-2 flex flex-wrap gap-2 text-xs font-medium">
            <span className="rounded-full bg-blue-50/80 px-2.5 py-1 text-blue-600">
              Activos (Estatus 1): {activeCount}
            </span>
            <span className="rounded-full bg-indigo-50/80 px-2.5 py-1 text-indigo-600">
              Otros: {inactiveCount}
            </span>
          </div>
        </div>
      </div>
      <div className="p-4">
        <MaterialReactTable table={table} />
      </div>

      <ConfirmacionEliminacion
        open={deleteTarget !== null}
        title="Confirmar eliminación"
        message={
          deleteTarget ? (
            <>
              ¿Eliminar al barbero <span className="font-semibold text-slate-900">«{deleteTarget.nombre}»</span>? Esta
              acción no se puede deshacer.
            </>
          ) : (
            ""
          )
        }
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        confirmText="Eliminar"
        cancelText="Cancelar"
        requireTextMatch={deleteTarget?.nombre ?? ""}
        textMatchLabel={`Escribe el nombre exacto «${deleteTarget?.nombre ?? ""}» para confirmar la eliminación`}
        loading={deleteBarbero.isPending}
      />
    </section>
  );
}
