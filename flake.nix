{
  description = "web-dentaku is a static dentaku on website.";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixpkgs-unstable";
    # 複数のシステム(Linux, Macなど)に簡単に対応するためのライブラリ
    utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, utils }:
    utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
      in
      {
        devShells.default = pkgs.mkShell {
          packages = [
            pkgs.bats
            pkgs.shfmt
            pkgs.shellcheck
          ];
        };
      }
    );
}
