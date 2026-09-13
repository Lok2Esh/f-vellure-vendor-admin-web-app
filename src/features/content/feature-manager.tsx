"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Eye, ArrowUpDown, RefreshCw } from "lucide-react";
import { usePortal } from "@/components/portal/providers";
import { DataTable, type Column } from "@/components/portal/data-table";
import {
  Badge,
  Button,
  Card,
  CardHeader,
  DetailList,
  Dialog,
  EmptyState,
  Field,
  Grid,
  Heading,
  Notice,
  PageHeader,
  Row,
  Select,
  Skeleton,
  Stack,
  Text,
} from "@/components/portal/ui";
import { date, number } from "@/platform/format";
import { FeatureEditor } from "./feature-editor";
import { featureService } from "./service";
import {
  placements,
  featureTypes,
  type Feature,
  type FeatureInput,
  type FeatureService,
} from "./contracts";

export function FeatureManager({
  service = featureService,
  initialPlacement = "",
}: {
  service?: FeatureService;
  initialPlacement?: string;
}) {
  const { session, locale, toast } = usePortal(),
    client = useQueryClient();
  const admin =
    session.workspace === "admin" && !!session.roles?.includes("SUPER_ADMIN");
  const [page, setPage] = useState(1),
    [limit, setLimit] = useState(20),
    [search, setSearch] = useState(""),
    [placement, setPlacement] = useState(initialPlacement),
    [type, setType] = useState(""),
    [active, setActive] = useState("");
  const [selected, setSelected] = useState<string | null>(null),
    [editing, setEditing] = useState<Feature | "new" | null>(null),
    [deleting, setDeleting] = useState<Feature | null>(null),
    [preview, setPreview] = useState(false),
    [reorder, setReorder] = useState<
      { id: string; title: string; sortOrder: number }[] | null
    >(null);
  const query = {
    page,
    limit,
    search,
    placement,
    type,
    isActive: active,
    locale,
  };
  const key = ["features", session.id, session.vendorId];
  const list = useQuery({
    queryKey: [...key, query],
    queryFn: ({ signal }) => service.list(query, signal),
  });
  const detail = useQuery({
    queryKey: [...key, "detail", selected],
    queryFn: ({ signal }) => service.details(selected!, signal),
    enabled: !!selected,
  });
  const customer = useQuery({
    queryKey: [...key, "preview", placement, type, locale],
    queryFn: ({ signal }) =>
      service.preview({ page: 1, limit: 100, placement, type, locale }, signal),
    enabled: preview,
  });
  const mutation = useMutation({
    mutationFn: async (
      action:
        | { type: "save"; value: FeatureInput; id?: string }
        | { type: "toggle" | "delete"; id: string }
        | { type: "reorder"; items: { id: string; sortOrder: number }[] },
    ) => {
      if (action.type === "save")
        return action.id
          ? service.update(action.id, action.value)
          : service.create(action.value);
      if (action.type === "toggle") return service.toggle(action.id);
      if (action.type === "delete") return service.remove(action.id);
      if (action.type === "reorder") return service.reorder(action.items);
    },
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: key });
      setEditing(null);
      setDeleting(null);
      setReorder(null);
      toast("Feature changes saved.");
    },
  });
  const columns: Column<Feature>[] = [
    {
      id: "title",
      label: "Feature",
      render: (feature) => (
        <Stack className="v-feature-title">
          <Text className="v-table-name">
            {locale === "hi"
              ? feature.titleHindi || feature.title
              : feature.title}
          </Text>
          <Text muted className="v-small">
            {feature.subtitle || feature.type.replaceAll("_", " ")}
          </Text>
        </Stack>
      ),
      exportValue: (feature) => feature.title,
    },
    {
      id: "placement",
      label: "Placement",
      render: (feature) => (
        <Text>{feature.placement.replaceAll("_", " ")}</Text>
      ),
      exportValue: (feature) => feature.placement,
    },
    {
      id: "status",
      label: "Visibility",
      render: (feature) => (
        <Badge status={feature.isActive ? "confirmed" : "draft"}>
          {feature.isActive ? "Enabled" : "Hidden"}
        </Badge>
      ),
      exportValue: (feature) => (feature.isActive ? "Enabled" : "Hidden"),
    },
    {
      id: "order",
      label: "Order",
      render: (feature) => <Text>{number(feature.sortOrder)}</Text>,
      exportValue: (feature) => String(feature.sortOrder),
    },
    {
      id: "actions",
      label: "Actions",
      render: (feature) => (
        <Row>
          <Button
            variant="ghost"
            disabled={mutation.isPending}
            onClick={() => {
              mutation.reset();
              mutation.mutate({ type: "toggle", id: feature.id });
            }}
          >
            {feature.isActive ? "Hide" : "Enable"}
          </Button>
          <Button variant="ghost" onClick={() => setSelected(feature.id)}>
            Details
          </Button>
        </Row>
      ),
    },
  ];
  const failure = mutation.isError ? (
    <Notice tone="error">{mutation.error.message}</Notice>
  ) : null;
  return (
    <Stack>
      <PageHeader
        eyebrow={admin ? "APP CONTENT" : "YOUR BUSINESS CONTENT"}
        title="Features that get discovered."
        description="Manage the moments customers see across Vellure."
        actions={
          <Row>
            <Button onClick={() => setPreview(true)}>
              <Eye size={16} />
              Customer preview
            </Button>
            {admin && (
              <Button
                disabled={!list.data?.data.length}
                onClick={() => {
                  mutation.reset();
                  setReorder(
                    list.data!.data.map(({ id, title, sortOrder }) => ({
                      id,
                      title,
                      sortOrder,
                    })),
                  );
                }}
              >
                <ArrowUpDown size={16} />
                Reorder
              </Button>
            )}
            <Button
              variant="primary"
              onClick={() => {
                mutation.reset();
                setEditing("new");
              }}
            >
              <Plus size={16} />
              Add feature
            </Button>
          </Row>
        }
      />
      <Row className="v-feature-filters">
        <Select
          label="Filter placement"
          value={placement}
          onChange={(e) => {
            setPlacement(e.target.value);
            setPage(1);
          }}
          options={[
            { value: "", label: "All placements" },
            ...placements.map((value) => ({
              value,
              label: value.replaceAll("_", " "),
            })),
          ]}
        />
        <Select
          label="Filter type"
          value={type}
          onChange={(e) => {
            setType(e.target.value);
            setPage(1);
          }}
          options={[
            { value: "", label: "All formats" },
            ...featureTypes.map((value) => ({
              value,
              label: value.replaceAll("_", " "),
            })),
          ]}
        />
        <Select
          label="Filter visibility"
          value={active}
          onChange={(e) => {
            setActive(e.target.value);
            setPage(1);
          }}
          options={[
            { value: "", label: "All visibility" },
            { value: "true", label: "Enabled" },
            { value: "false", label: "Hidden" },
          ]}
        />
        <Button
          variant="ghost"
          aria-label="Refresh features"
          onClick={() => list.refetch()}
        >
          <RefreshCw size={16} />
        </Button>
      </Row>
      {failure}
      <Card>
        {list.isPending ? (
          <Skeleton />
        ) : list.isError ? (
          <EmptyState
            title="Features couldn’t load"
            description={list.error.message}
            action={<Button onClick={() => list.refetch()}>Try again</Button>}
          />
        ) : (
          <>
            <CardHeader
              title="Content library"
              subtitle={`${number(list.data.meta.total)} features · visibility is also controlled by your schedule`}
            />
            <DataTable
              rows={list.data.data}
              columns={columns}
              resourceName="features"
              caption="Feature management"
              searchText={(feature) => feature.title}
              server={{
                page,
                limit,
                total: list.data.meta.total,
                search,
                onPage: setPage,
                onLimit: (value) => {
                  setLimit(value);
                  setPage(1);
                },
                onSearch: (value) => {
                  setSearch(value);
                  setPage(1);
                },
              }}
            />
          </>
        )}
      </Card>
      <Dialog
        open={!!selected}
        onClose={() => setSelected(null)}
        title="Feature details"
        drawer
      >
        {detail.isPending ? (
          <Skeleton />
        ) : detail.isError ? (
          <Notice tone="error">{detail.error.message}</Notice>
        ) : (
          detail.data && (
            <Stack>
              <Heading>{detail.data.title}</Heading>
              <Text muted>
                {detail.data.description || "No description added."}
              </Text>
              <DetailList
                items={[
                  {
                    label: "Hindi title",
                    value: detail.data.titleHindi || "Not provided",
                  },
                  { label: "Placement", value: detail.data.placement },
                  {
                    label: "Visibility",
                    value: detail.data.isActive ? "Enabled" : "Hidden",
                  },
                  {
                    label: "Starts",
                    value: detail.data.startsAt
                      ? date(detail.data.startsAt, locale)
                      : "Immediately",
                  },
                  {
                    label: "Ends",
                    value: detail.data.endsAt
                      ? date(detail.data.endsAt, locale)
                      : "No end date",
                  },
                  {
                    label: "Destination",
                    value:
                      detail.data.targetUrl || detail.data.targetId || "None",
                  },
                  {
                    label: "Updated",
                    value: date(detail.data.updatedAt, locale),
                  },
                ]}
              />
              <Button
                variant="primary"
                onClick={() => {
                  mutation.reset();
                  setEditing(detail.data!);
                  setSelected(null);
                }}
              >
                Edit feature
              </Button>
              {admin && (
                <Button
                  onClick={() => {
                    mutation.reset();
                    setDeleting(detail.data!);
                    setSelected(null);
                  }}
                >
                  Delete feature
                </Button>
              )}
            </Stack>
          )
        )}
      </Dialog>
      <Dialog
        open={!!editing}
        onClose={() => {
          if (!mutation.isPending) setEditing(null);
        }}
        title={editing === "new" ? "Create feature" : "Edit feature"}
        drawer
      >
        {editing && (
          <Stack>
            {failure}
            <FeatureEditor
              key={editing === "new" ? "new" : editing.id}
              feature={editing === "new" ? undefined : editing}
              vendor={!admin}
              pending={mutation.isPending}
              onSave={(value) =>
                mutation.mutate({
                  type: "save",
                  value,
                  id: editing === "new" ? undefined : editing.id,
                })
              }
            />
          </Stack>
        )}
      </Dialog>
      <Dialog
        open={!!deleting}
        onClose={() => {
          if (!mutation.isPending) setDeleting(null);
        }}
        title="Delete feature permanently?"
      >
        <Stack>
          <Text>
            “{deleting?.title}” will be removed from Vellure. This cannot be
            undone.
          </Text>
          {failure}
          <Row>
            <Button
              disabled={mutation.isPending}
              onClick={() => setDeleting(null)}
            >
              Keep feature
            </Button>
            <Button
              variant="primary"
              disabled={mutation.isPending}
              onClick={() =>
                deleting && mutation.mutate({ type: "delete", id: deleting.id })
              }
            >
              Delete permanently
            </Button>
          </Row>
        </Stack>
      </Dialog>
      <Dialog
        open={!!reorder}
        onClose={() => {
          if (!mutation.isPending) setReorder(null);
        }}
        title="Reorder visible features"
      >
        <Stack>
          <Text muted>
            Set display positions for these {reorder?.length} results. Lower
            numbers appear first within each placement. Other features keep
            their current positions.
          </Text>
          {reorder?.map((item, index) => (
            <Field
              key={item.id}
              label={item.title}
              type="number"
              min={0}
              step={1}
              value={item.sortOrder}
              onChange={(event) =>
                setReorder(
                  reorder.map((row, i) =>
                    i === index
                      ? { ...row, sortOrder: Number(event.target.value) }
                      : row,
                  ),
                )
              }
            />
          ))}
          {failure}
          <Button
            variant="primary"
            disabled={mutation.isPending}
            onClick={() =>
              reorder &&
              mutation.mutate({
                type: "reorder",
                items: reorder.map(({ id, sortOrder }) => ({ id, sortOrder })),
              })
            }
          >
            Save display order
          </Button>
        </Stack>
      </Dialog>
      <Dialog
        open={preview}
        onClose={() => setPreview(false)}
        title="Customer app content"
      >
        <Stack>
          <Text muted>
            Active content returned by the customer API, using its current
            schedule and {locale === "hi" ? "Hindi" : "English"} copy.
          </Text>
          {customer.isPending ? (
            <Skeleton />
          ) : customer.isError ? (
            <Notice tone="error">{customer.error.message}</Notice>
          ) : !customer.data?.length ? (
            <EmptyState
              title="Nothing published in this view"
              description="Enable a feature and check its scheduled dates."
            />
          ) : (
            <Grid>
              {customer.data.map((feature) => (
                <Card key={feature.id} className="v-feature-preview">
                  <Stack>
                    {feature.badge && <Badge>{feature.badge}</Badge>}
                    <Heading>{feature.displayTitle || feature.title}</Heading>
                    <Text>{feature.displaySubtitle || feature.subtitle}</Text>
                    <Text muted>
                      {feature.type.replaceAll("_", " ")} ·{" "}
                      {feature.placement.replaceAll("_", " ")}
                    </Text>
                  </Stack>
                </Card>
              ))}
            </Grid>
          )}
        </Stack>
      </Dialog>
    </Stack>
  );
}
