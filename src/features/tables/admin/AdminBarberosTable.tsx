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
      showColumnFilters: true,
      showGlobalFilter: true,
      pagination: { pageIndex: 0, pageSize: 5 },
    },
    paginationDisplayMode: "pages",
    displayColumnDefOptions: {
      "mrt-row-actions": { header: "Acciones", size: 140 },
    },
    renderTopToolbarCustomActions: () => (
      <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700">
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
          className="rounded-xl border border-blue-200 bg-blue-50/70 text-blue-700 shadow-sm hover:border-blue-300 hover:bg-blue-100"
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
          className="rounded-xl border border-rose-200 bg-rose-50/80 text-rose-700 shadow-sm hover:border-rose-300 hover:bg-rose-100"
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
        border: "1px solid #dbe4f0",
        borderRadius: "0.9rem",
        overflow: "hidden",
        boxShadow: "0 8px 28px -20px rgba(37, 99, 235, 0.35)",
      },
    },
    muiTopToolbarProps: {
      sx: {
        background:
          "linear-gradient(90deg, rgba(239,246,255,0.7) 0%, rgba(248,250,252,0.7) 100%)",
        borderBottom: "1px solid #e2e8f0",
        px: "0.75rem",
      },
    },
    muiTableHeadCellProps: {
      sx: {
        backgroundColor: "#f8fafc",
        color: "#334155",
        fontWeight: 700,
        fontSize: "0.74rem",
        borderBottom: "1px solid #e2e8f0",
      },
    },
    muiTableBodyRowProps: ({ row }) => ({
      sx: {
        backgroundColor: row.index % 2 === 0 ? "#ffffff" : "#f8fafc",
        "&:hover td": { backgroundColor: "#eff6ff" },
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
          borderRadius: "12px",
          backgroundColor: "#ffffff",
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
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-linear-to-br from-slate-50 to-white px-5 py-4">
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
        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-3">
          <div className="mb-2 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wide">
            <span className="text-slate-500">Resumen del equipo</span>
            <span className="text-slate-700">{data.length} perfiles</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-emerald-500"
              style={{
                width: `${data.length ? (activeCount / data.length) * 100 : 0}%`,
              }}
            />
          </div>
          <div className="mt-2 flex flex-wrap gap-2 text-xs font-medium">
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700">
              Activos (Estatus 1): {activeCount}
            </span>
            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-blue-700">
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
