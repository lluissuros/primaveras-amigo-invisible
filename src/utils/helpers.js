export function paginate(elements, page, pageSize) {
  return elements.slice(page * pageSize, page * pageSize + pageSize);
}
