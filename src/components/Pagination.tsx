import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "./ui/pagination";

export const PaginationDemo = ({ totalPage, currentPage, onPageChange }) => {
  const renderPages = () => {
    const pages = [];

    // Nếu số trang nhỏ hơn hoặc bằng 5 => hiển thị tất cả
    if (totalPage <= 5) {
      for (let i = 1; i <= totalPage; i++) {
        pages.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              isActive={i === currentPage}
              onClick={() => onPageChange(i)}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Luôn hiển thị trang 1
      pages.push(
        <PaginationItem key={1}>
          <PaginationLink
            href="#"
            isActive={1 === currentPage}
            onClick={() => onPageChange(1)}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      // Hiển thị dấu "..." nếu currentPage > 3
      if (currentPage > 3) {
        pages.push(
          <PaginationItem key="start-ellipsis">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Hiển thị các trang xung quanh currentPage
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPage - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              isActive={i === currentPage}
              onClick={() => onPageChange(i)}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      // Hiển thị dấu "..." nếu currentPage < totalPage - 2
      if (currentPage < totalPage - 2) {
        pages.push(
          <PaginationItem key="end-ellipsis">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Luôn hiển thị trang cuối
      pages.push(
        <PaginationItem key={totalPage}>
          <PaginationLink
            href="#"
            isActive={totalPage === currentPage}
            onClick={() => onPageChange(totalPage)}
          >
            {totalPage}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return pages;
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <Button
            className="w-10 h-10"
            variant="outline"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft />
          </Button>
        </PaginationItem>

        {renderPages()}

        <PaginationItem>
          <Button
            className="w-10 h-10"
            variant="outline"
            onClick={() => onPageChange(Math.min(totalPage, currentPage + 1))}
            disabled={currentPage === totalPage}
          >
            <ChevronRight />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
